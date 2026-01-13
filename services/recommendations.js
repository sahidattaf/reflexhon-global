// Recommendations Service
// Provides intelligent content recommendations using hybrid algorithms

/**
 * Recommendations Service
 * Uses content-based, collaborative, and popularity-based filtering
 */
export class RecommendationsService {
  constructor(dbService) {
    this.db = dbService;
  }

  /**
   * Get recommendations for a specific dataset
   * Uses hybrid approach combining multiple signals
   * @param {string} datasetId - Dataset ID
   * @param {number} limit - Number of recommendations
   * @returns {Promise<Object>} Recommendations
   */
  async getRecommendations(datasetId, limit = 5) {
    try {
      // Get the source dataset
      const sourceSql = `
        SELECT * FROM cultural_datasets
        WHERE id = ? AND is_active = 1 AND deleted_at IS NULL
      `;
      const source = await this.db.querySingle(sourceSql, [datasetId]);

      if (!source.result) {
        return {
          success: false,
          error: { message: 'Dataset not found' }
        };
      }

      const dataset = source.result;

      // Get multiple recommendation sets
      const [
        similarByCategory,
        similarByTags,
        popularInCategory,
        trending
      ] = await Promise.all([
        this.getSimilarByCategory(dataset, limit * 2),
        this.getSimilarByTags(dataset, limit * 2),
        this.getPopularInCategory(dataset.category, limit * 2),
        this.getTrendingDatasets(limit * 2)
      ]);

      // Score and rank recommendations
      const recommendations = this.hybridRanking(
        datasetId,
        {
          similarByCategory: similarByCategory.data || [],
          similarByTags: similarByTags.data || [],
          popularInCategory: popularInCategory.data || [],
          trending: trending.data || []
        },
        limit
      );

      return {
        success: true,
        source: {
          id: dataset.id,
          input: dataset.input,
          category: dataset.category
        },
        recommendations,
        total: recommendations.length,
        algorithms_used: [
          'content_similarity',
          'category_matching',
          'tag_matching',
          'popularity_score',
          'trending_score'
        ]
      };
    } catch (error) {
      console.error('Recommendations: Failed to get recommendations:', error);
      throw error;
    }
  }

  /**
   * Get similar datasets by category
   * @param {Object} dataset - Source dataset
   * @param {number} limit - Number of results
   * @returns {Promise<Object>} Similar datasets
   */
  async getSimilarByCategory(dataset, limit = 10) {
    try {
      const sql = `
        SELECT
          id, input, output, category, tags,
          usage_count, positive_feedback, negative_feedback,
          cultural_alignment_score
        FROM cultural_datasets
        WHERE category = ?
          AND id != ?
          AND is_active = 1
          AND deleted_at IS NULL
        ORDER BY usage_count DESC, cultural_alignment_score DESC
        LIMIT ?
      `;

      const result = await this.db.query(sql, [
        dataset.category,
        dataset.id,
        limit
      ]);

      return {
        success: true,
        data: result.results || []
      };
    } catch (error) {
      console.error('Recommendations: Failed to get similar by category:', error);
      return { success: false, data: [] };
    }
  }

  /**
   * Get similar datasets by tags
   * @param {Object} dataset - Source dataset
   * @param {number} limit - Number of results
   * @returns {Promise<Object>} Similar datasets
   */
  async getSimilarByTags(dataset, limit = 10) {
    if (!dataset.tags) {
      return { success: false, data: [] };
    }

    try {
      // Parse tags (assuming JSON array format)
      let tags = [];
      try {
        tags = JSON.parse(dataset.tags);
      } catch (e) {
        // If not JSON, split by comma
        tags = dataset.tags.split(',').map(t => t.trim());
      }

      if (tags.length === 0) {
        return { success: false, data: [] };
      }

      // Use FTS to find datasets with similar tags
      const tagQuery = tags.join(' OR ');
      const sql = `
        SELECT
          cd.id, cd.input, cd.output, cd.category, cd.tags,
          cd.usage_count, cd.positive_feedback, cd.negative_feedback,
          cd.cultural_alignment_score
        FROM cultural_datasets_fts fts
        JOIN cultural_datasets cd ON fts.id = cd.id
        WHERE fts.tags MATCH ?
          AND cd.id != ?
          AND cd.is_active = 1
          AND cd.deleted_at IS NULL
        ORDER BY cd.usage_count DESC
        LIMIT ?
      `;

      const result = await this.db.query(sql, [tagQuery, dataset.id, limit]);

      return {
        success: true,
        data: result.results || []
      };
    } catch (error) {
      console.error('Recommendations: Failed to get similar by tags:', error);
      return { success: false, data: [] };
    }
  }

  /**
   * Get popular datasets in same category
   * @param {string} category - Category
   * @param {number} limit - Number of results
   * @returns {Promise<Object>} Popular datasets
   */
  async getPopularInCategory(category, limit = 10) {
    try {
      const sql = `
        SELECT
          id, input, output, category, tags,
          usage_count, positive_feedback, negative_feedback,
          cultural_alignment_score,
          ROUND(CAST(positive_feedback AS FLOAT) / NULLIF(positive_feedback + negative_feedback, 0) * 100, 2) as satisfaction_rate
        FROM cultural_datasets
        WHERE category = ?
          AND is_active = 1
          AND deleted_at IS NULL
        ORDER BY
          usage_count DESC,
          positive_feedback DESC,
          cultural_alignment_score DESC
        LIMIT ?
      `;

      const result = await this.db.query(sql, [category, limit]);

      return {
        success: true,
        data: result.results || []
      };
    } catch (error) {
      console.error('Recommendations: Failed to get popular:', error);
      return { success: false, data: [] };
    }
  }

  /**
   * Get trending datasets
   * @param {number} limit - Number of results
   * @returns {Promise<Object>} Trending datasets
   */
  async getTrendingDatasets(limit = 10) {
    try {
      const sql = `
        SELECT
          id, input, output, category, tags,
          usage_count, positive_feedback, negative_feedback,
          cultural_alignment_score,
          last_used_at
        FROM cultural_datasets
        WHERE is_active = 1
          AND deleted_at IS NULL
          AND last_used_at IS NOT NULL
          AND last_used_at >= datetime('now', '-7 days')
        ORDER BY
          usage_count DESC,
          last_used_at DESC
        LIMIT ?
      `;

      const result = await this.db.query(sql, [limit]);

      return {
        success: true,
        data: result.results || []
      };
    } catch (error) {
      console.error('Recommendations: Failed to get trending:', error);
      return { success: false, data: [] };
    }
  }

  /**
   * Hybrid ranking algorithm
   * Combines multiple recommendation sources with weighted scoring
   * @param {string} sourceId - Source dataset ID
   * @param {Object} sources - Recommendation sources
   * @param {number} limit - Number of results
   * @returns {Array} Ranked recommendations
   */
  hybridRanking(sourceId, sources, limit = 5) {
    const scores = new Map();

    // Weight factors for different signals
    const weights = {
      similarByCategory: 3.0,
      similarByTags: 2.5,
      popularInCategory: 2.0,
      trending: 1.5
    };

    // Score each dataset from each source
    Object.entries(sources).forEach(([sourceName, datasets]) => {
      datasets.forEach((dataset, index) => {
        if (dataset.id === sourceId) return; // Skip source dataset

        if (!scores.has(dataset.id)) {
          scores.set(dataset.id, {
            dataset,
            score: 0,
            signals: []
          });
        }

        const entry = scores.get(dataset.id);

        // Position-based scoring (earlier = higher score)
        const positionScore = (datasets.length - index) / datasets.length;

        // Usage-based scoring
        const usageScore = Math.min(dataset.usage_count / 100, 1);

        // Quality-based scoring
        const qualityScore = dataset.cultural_alignment_score / 100;

        // Satisfaction-based scoring
        const totalFeedback = dataset.positive_feedback + dataset.negative_feedback;
        const satisfactionScore = totalFeedback > 0
          ? dataset.positive_feedback / totalFeedback
          : 0.5;

        // Combined score for this source
        const sourceScore =
          (positionScore * 0.4) +
          (usageScore * 0.3) +
          (qualityScore * 0.2) +
          (satisfactionScore * 0.1);

        // Apply weight and add to total score
        entry.score += sourceScore * weights[sourceName];
        entry.signals.push(sourceName);
      });
    });

    // Convert to array and sort by score
    const ranked = Array.from(scores.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(entry => ({
        id: entry.dataset.id,
        input: entry.dataset.input,
        output: entry.dataset.output,
        category: entry.dataset.category,
        tags: entry.dataset.tags,
        usage_count: entry.dataset.usage_count,
        cultural_alignment_score: entry.dataset.cultural_alignment_score,
        recommendation_score: parseFloat(entry.score.toFixed(2)),
        recommendation_reasons: this.getRecommendationReasons(entry.signals)
      }));

    return ranked;
  }

  /**
   * Get human-readable recommendation reasons
   * @param {Array} signals - Signals that contributed to recommendation
   * @returns {Array} Reasons
   */
  getRecommendationReasons(signals) {
    const reasonMap = {
      similarByCategory: 'Same category',
      similarByTags: 'Similar topics',
      popularInCategory: 'Popular in category',
      trending: 'Trending now'
    };

    return signals.map(signal => reasonMap[signal] || signal);
  }

  /**
   * Get personalized recommendations based on user history
   * @param {string} sessionId - Session ID
   * @param {number} limit - Number of recommendations
   * @returns {Promise<Object>} Personalized recommendations
   */
  async getPersonalizedRecommendations(sessionId, limit = 10) {
    try {
      // Get user's recent activity
      const activitySql = `
        SELECT DISTINCT dataset_id
        FROM (
          SELECT clicked_result_id as dataset_id
          FROM search_analytics
          WHERE session_id = ?
            AND clicked_result_id IS NOT NULL
          ORDER BY created_at DESC
          LIMIT 5
        )
      `;

      const activity = await this.db.query(activitySql, [sessionId]);
      const viewedIds = activity.results?.map(r => r.dataset_id) || [];

      if (viewedIds.length === 0) {
        // No history - return trending datasets
        return this.getTrendingDatasets(limit);
      }

      // Get recommendations for each viewed dataset
      const allRecommendations = [];
      for (const datasetId of viewedIds) {
        const recs = await this.getRecommendations(datasetId, 3);
        if (recs.success && recs.recommendations) {
          allRecommendations.push(...recs.recommendations);
        }
      }

      // Deduplicate and rank
      const uniqueRecs = new Map();
      allRecommendations.forEach(rec => {
        if (!viewedIds.includes(rec.id)) {
          if (!uniqueRecs.has(rec.id)) {
            uniqueRecs.set(rec.id, rec);
          } else {
            // If already exists, boost the score
            const existing = uniqueRecs.get(rec.id);
            existing.recommendation_score += rec.recommendation_score * 0.5;
          }
        }
      });

      const recommendations = Array.from(uniqueRecs.values())
        .sort((a, b) => b.recommendation_score - a.recommendation_score)
        .slice(0, limit);

      return {
        success: true,
        recommendations,
        total: recommendations.length,
        based_on_history: viewedIds.length
      };
    } catch (error) {
      console.error('Recommendations: Failed to get personalized:', error);
      // Fallback to trending
      return this.getTrendingDatasets(limit);
    }
  }

  /**
   * Get "users also viewed" recommendations
   * @param {string} datasetId - Dataset ID
   * @param {number} limit - Number of recommendations
   * @returns {Promise<Object>} Collaborative recommendations
   */
  async getUsersAlsoViewed(datasetId, limit = 5) {
    try {
      // Find sessions that viewed this dataset
      const sessionsSql = `
        SELECT DISTINCT session_id
        FROM search_analytics
        WHERE clicked_result_id = ?
          AND session_id IS NOT NULL
        LIMIT 50
      `;

      const sessions = await this.db.query(sessionsSql, [datasetId]);
      const sessionIds = sessions.results?.map(r => r.session_id) || [];

      if (sessionIds.length === 0) {
        // No collaborative data - fall back to content-based
        const sourceSql = `SELECT * FROM cultural_datasets WHERE id = ?`;
        const source = await this.db.querySingle(sourceSql, [datasetId]);
        if (source.result) {
          return this.getSimilarByCategory(source.result, limit);
        }
        return { success: false, data: [] };
      }

      // Find what else these sessions viewed
      const placeholders = sessionIds.map(() => '?').join(',');
      const alsoViewedSql = `
        SELECT
          clicked_result_id as id,
          COUNT(*) as co_occurrence_count
        FROM search_analytics
        WHERE session_id IN (${placeholders})
          AND clicked_result_id IS NOT NULL
          AND clicked_result_id != ?
        GROUP BY clicked_result_id
        ORDER BY co_occurrence_count DESC
        LIMIT ?
      `;

      const alsoViewed = await this.db.query(
        alsoViewedSql,
        [...sessionIds, datasetId, limit]
      );

      // Get full dataset details
      if (!alsoViewed.results || alsoViewed.results.length === 0) {
        return { success: true, data: [] };
      }

      const datasetIds = alsoViewed.results.map(r => r.id);
      const datasetPlaceholders = datasetIds.map(() => '?').join(',');
      const detailsSql = `
        SELECT
          id, input, output, category, tags,
          usage_count, cultural_alignment_score
        FROM cultural_datasets
        WHERE id IN (${datasetPlaceholders})
          AND is_active = 1
          AND deleted_at IS NULL
      `;

      const details = await this.db.query(detailsSql, datasetIds);

      return {
        success: true,
        data: details.results || []
      };
    } catch (error) {
      console.error('Recommendations: Failed to get users also viewed:', error);
      return { success: false, data: [] };
    }
  }
}

/**
 * Create recommendations service instance
 * @param {Object} dbService - Database service
 * @returns {RecommendationsService} Recommendations service
 */
export function createRecommendationsService(dbService) {
  return new RecommendationsService(dbService);
}

export default RecommendationsService;
