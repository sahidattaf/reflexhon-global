// Cultural Data Service
// Specialized service for managing Papiamentu cultural datasets in D1

import { generateId, getCurrentTimestamp } from './db.js';

/**
 * Cultural Data Service
 * Handles CRUD operations for cultural_datasets table
 */
export class CulturalDataService {
  constructor(dbService) {
    if (!dbService) {
      throw new Error('Database service is required');
    }
    this.db = dbService;
  }

  /**
   * Get all cultural datasets
   * @param {Object} options - Query options {limit, offset, category, language, status}
   * @returns {Promise<Object>} Datasets
   */
  async getAll(options = {}) {
    try {
      const {
        limit = 100,
        offset = 0,
        category = null,
        language = null,
        status = 'approved',
        sortBy = 'created_at',
        sortOrder = 'DESC'
      } = options;

      let sql = 'SELECT * FROM cultural_datasets WHERE is_active = 1 AND deleted_at IS NULL';
      const params = [];

      if (status) {
        sql += ' AND validation_status = ?';
        params.push(status);
      }

      if (category) {
        sql += ' AND category = ?';
        params.push(category);
      }

      if (language) {
        sql += ' AND language = ?';
        params.push(language);
      }

      sql += ` ORDER BY ${sortBy} ${sortOrder} LIMIT ? OFFSET ?`;
      params.push(limit, offset);

      const result = await this.db.query(sql, params);

      // Get total count
      let countSql = 'SELECT COUNT(*) as total FROM cultural_datasets WHERE is_active = 1 AND deleted_at IS NULL';
      const countParams = [];

      if (status) {
        countSql += ' AND validation_status = ?';
        countParams.push(status);
      }

      if (category) {
        countSql += ' AND category = ?';
        countParams.push(category);
      }

      if (language) {
        countSql += ' AND language = ?';
        countParams.push(language);
      }

      const countResult = await this.db.querySingle(countSql, countParams);

      return {
        success: true,
        data: result.results,
        pagination: {
          total: countResult.result?.total || 0,
          limit,
          offset,
          hasMore: (offset + limit) < (countResult.result?.total || 0)
        }
      };
    } catch (error) {
      console.error('Error fetching cultural datasets:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  /**
   * Get dataset by ID
   * @param {string} id - Dataset ID
   * @returns {Promise<Object>} Dataset
   */
  async getById(id) {
    try {
      const sql = 'SELECT * FROM cultural_datasets WHERE id = ? AND is_active = 1 AND deleted_at IS NULL';
      const result = await this.db.querySingle(sql, [id]);

      if (!result.result) {
        return {
          success: false,
          error: 'Dataset not found',
          data: null
        };
      }

      // Increment usage count
      await this.incrementUsage(id);

      return {
        success: true,
        data: result.result
      };
    } catch (error) {
      console.error('Error fetching dataset:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  /**
   * Search datasets by text
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @returns {Promise<Object>} Search results
   */
  async search(query, options = {}) {
    try {
      const {
        limit = 50,
        offset = 0,
        category = null
      } = options;

      // Use FTS (Full-Text Search) if available
      let sql = `
        SELECT cd.* FROM cultural_datasets cd
        JOIN cultural_datasets_fts fts ON cd.rowid = fts.rowid
        WHERE fts MATCH ? AND cd.is_active = 1 AND cd.deleted_at IS NULL
      `;
      const params = [query];

      if (category) {
        sql += ' AND cd.category = ?';
        params.push(category);
      }

      sql += ' ORDER BY cd.usage_count DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const result = await this.db.query(sql, params);

      return {
        success: true,
        data: result.results,
        query: query
      };
    } catch (error) {
      console.error('Error searching datasets:', error);
      // Fallback to LIKE search if FTS fails
      return this.searchFallback(query, options);
    }
  }

  /**
   * Fallback search using LIKE
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @returns {Promise<Object>} Search results
   */
  async searchFallback(query, options = {}) {
    const {
      limit = 50,
      offset = 0,
      category = null
    } = options;

    let sql = `
      SELECT * FROM cultural_datasets
      WHERE (input LIKE ? OR output LIKE ?)
      AND is_active = 1 AND deleted_at IS NULL
    `;
    const params = [`%${query}%`, `%${query}%`];

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    sql += ' ORDER BY usage_count DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const result = await this.db.query(sql, params);

    return {
      success: true,
      data: result.results,
      query: query,
      method: 'fallback'
    };
  }

  /**
   * Get datasets by category
   * @param {string} category - Category name
   * @param {number} limit - Max results
   * @returns {Promise<Object>} Datasets
   */
  async getByCategory(category, limit = 50) {
    return this.getAll({ category, limit });
  }

  /**
   * Create new dataset
   * @param {Object} data - Dataset data
   * @returns {Promise<Object>} Created dataset
   */
  async create(data) {
    try {
      const id = data.id || generateId();
      const now = getCurrentTimestamp();

      const dataset = {
        id,
        input: data.input,
        output: data.output,
        category: data.category,
        language: data.language || 'papiamentu',
        cultural_context: data.cultural_context || 'caribbean',
        tags: data.tags ? JSON.stringify(data.tags) : null,
        difficulty_level: data.difficulty_level || null,
        source: data.source || 'manual',
        validation_status: data.validation_status || 'draft',
        cultural_alignment_score: data.cultural_alignment_score || 100,
        empathy_score: data.empathy_score || 100,
        respeto_score: data.respeto_score || 100,
        created_at: now,
        updated_at: now,
        is_active: 1
      };

      const result = await this.db.insert('cultural_datasets', dataset);

      if (result.success) {
        return {
          success: true,
          data: { id, ...dataset }
        };
      } else {
        return {
          success: false,
          error: result.error
        };
      }
    } catch (error) {
      console.error('Error creating dataset:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update dataset
   * @param {string} id - Dataset ID
   * @param {Object} data - Updated data
   * @returns {Promise<Object>} Update result
   */
  async update(id, data) {
    try {
      const updateData = {
        ...data,
        updated_at: getCurrentTimestamp()
      };

      // Remove id from update data
      delete updateData.id;

      const result = await this.db.update('cultural_datasets', updateData, { id });

      return {
        success: result.success,
        message: result.success ? 'Dataset updated' : 'Update failed'
      };
    } catch (error) {
      console.error('Error updating dataset:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Delete dataset (soft delete)
   * @param {string} id - Dataset ID
   * @returns {Promise<Object>} Delete result
   */
  async delete(id) {
    try {
      const result = await this.db.softDelete('cultural_datasets', { id });

      return {
        success: result.success,
        message: result.success ? 'Dataset deleted' : 'Delete failed'
      };
    } catch (error) {
      console.error('Error deleting dataset:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Increment usage count for a dataset
   * @param {string} id - Dataset ID
   * @returns {Promise<void>}
   */
  async incrementUsage(id) {
    try {
      const sql = `
        UPDATE cultural_datasets
        SET usage_count = usage_count + 1,
            last_used_at = ?
        WHERE id = ?
      `;
      await this.db.query(sql, [getCurrentTimestamp(), id]);
    } catch (error) {
      console.error('Error incrementing usage:', error);
    }
  }

  /**
   * Add feedback to dataset
   * @param {string} id - Dataset ID
   * @param {boolean} positive - Positive or negative
   * @returns {Promise<Object>} Update result
   */
  async addFeedback(id, positive = true) {
    try {
      const field = positive ? 'positive_feedback' : 'negative_feedback';
      const sql = `
        UPDATE cultural_datasets
        SET ${field} = ${field} + 1
        WHERE id = ?
      `;
      const result = await this.db.query(sql, [id]);

      return {
        success: result.success
      };
    } catch (error) {
      console.error('Error adding feedback:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get popular datasets
   * @param {number} limit - Max results
   * @returns {Promise<Object>} Popular datasets
   */
  async getPopular(limit = 10) {
    try {
      const sql = `
        SELECT * FROM v_popular_datasets
        LIMIT ?
      `;
      const result = await this.db.query(sql, [limit]);

      return {
        success: true,
        data: result.results
      };
    } catch (error) {
      console.error('Error fetching popular datasets:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  /**
   * Get statistics for cultural datasets
   * @returns {Promise<Object>} Statistics
   */
  async getStats() {
    try {
      const stats = {};

      // Total count
      const totalResult = await this.db.querySingle(
        'SELECT COUNT(*) as total FROM cultural_datasets WHERE is_active = 1 AND deleted_at IS NULL'
      );
      stats.total = totalResult.result?.total || 0;

      // Count by category
      const categoryResult = await this.db.query(`
        SELECT category, COUNT(*) as count
        FROM cultural_datasets
        WHERE is_active = 1 AND deleted_at IS NULL
        GROUP BY category
      `);
      stats.byCategory = categoryResult.results;

      // Count by language
      const languageResult = await this.db.query(`
        SELECT language, COUNT(*) as count
        FROM cultural_datasets
        WHERE is_active = 1 AND deleted_at IS NULL
        GROUP BY language
      `);
      stats.byLanguage = languageResult.results;

      // Average scores
      const scoresResult = await this.db.querySingle(`
        SELECT
          AVG(cultural_alignment_score) as avg_cultural,
          AVG(empathy_score) as avg_empathy,
          AVG(respeto_score) as avg_respeto
        FROM cultural_datasets
        WHERE is_active = 1 AND deleted_at IS NULL
      `);
      stats.averageScores = scoresResult.result;

      return {
        success: true,
        stats: stats
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        success: false,
        error: error.message,
        stats: {}
      };
    }
  }
}

/**
 * Create cultural data service instance
 * @param {DatabaseService} dbService - Database service
 * @returns {CulturalDataService} Cultural data service
 */
export function createCulturalDataService(dbService) {
  return new CulturalDataService(dbService);
}

export default CulturalDataService;
