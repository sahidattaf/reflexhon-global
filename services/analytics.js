// Analytics Service
// Tracks API usage, searches, and provides analytics insights

import { nanoid } from 'nanoid';

/**
 * Analytics Service
 * Provides comprehensive analytics and insights
 */
export class AnalyticsService {
  constructor(dbService) {
    this.db = dbService;
  }

  /**
   * Log API request to api_logs table
   * @param {Object} requestData - Request information
   * @returns {Promise<void>}
   */
  async logApiRequest(requestData) {
    const {
      method,
      path,
      query,
      status,
      responseTime,
      clientIp,
      country,
      userAgent,
      cacheStatus,
      errorType = null,
      errorMessage = null
    } = requestData;

    try {
      const sql = `
        INSERT INTO api_logs (
          id, request_method, request_path, request_query,
          response_status, response_time_ms,
          client_ip, client_country, client_user_agent,
          cache_status, error_type, error_message, request_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      await this.db.execute(sql, [
        nanoid(),
        method,
        path,
        query ? JSON.stringify(query) : null,
        status,
        responseTime,
        clientIp,
        country,
        userAgent,
        cacheStatus,
        errorType,
        errorMessage,
        nanoid(16)
      ]);
    } catch (error) {
      console.error('Analytics: Failed to log API request:', error);
      // Don't throw - analytics shouldn't break the main flow
    }
  }

  /**
   * Log search query to search_analytics table
   * @param {Object} searchData - Search information
   * @returns {Promise<void>}
   */
  async logSearch(searchData) {
    const {
      query,
      type,
      resultsCount,
      searchTime,
      clientIp,
      country,
      userAgent,
      sessionId = null
    } = searchData;

    try {
      const sql = `
        INSERT INTO search_analytics (
          id, search_query, search_type, results_count,
          search_time_ms, client_ip, client_country,
          user_agent, session_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      await this.db.execute(sql, [
        nanoid(),
        query,
        type,
        resultsCount,
        searchTime,
        clientIp,
        country,
        userAgent,
        sessionId
      ]);
    } catch (error) {
      console.error('Analytics: Failed to log search:', error);
    }
  }

  /**
   * Log dataset click from search results
   * @param {string} searchQuery - Original search query
   * @param {string} datasetId - ID of clicked dataset
   * @param {number} position - Position in results
   * @returns {Promise<void>}
   */
  async logDatasetClick(searchQuery, datasetId, position) {
    try {
      // Update the most recent search with this query to add click info
      const sql = `
        UPDATE search_analytics
        SET clicked_result_id = ?, click_position = ?
        WHERE search_query = ?
          AND clicked_result_id IS NULL
        ORDER BY created_at DESC
        LIMIT 1
      `;

      await this.db.execute(sql, [datasetId, position, searchQuery]);
    } catch (error) {
      console.error('Analytics: Failed to log dataset click:', error);
    }
  }

  /**
   * Get analytics dashboard overview
   * @param {string} timeRange - Time range ('24h', '7d', '30d', 'all')
   * @returns {Promise<Object>} Dashboard data
   */
  async getDashboard(timeRange = '24h') {
    const timeFilter = this.getTimeFilter(timeRange);

    try {
      // Total requests
      const totalRequestsSql = `
        SELECT COUNT(*) as total
        FROM api_logs
        WHERE ${timeFilter}
      `;
      const totalRequests = await this.db.querySingle(totalRequestsSql);

      // Unique visitors
      const uniqueVisitorsSql = `
        SELECT COUNT(DISTINCT client_ip) as total
        FROM api_logs
        WHERE ${timeFilter}
      `;
      const uniqueVisitors = await this.db.querySingle(uniqueVisitorsSql);

      // Cache hit rate
      const cacheStatsSql = `
        SELECT
          SUM(CASE WHEN cache_status = 'HIT' THEN 1 ELSE 0 END) as hits,
          SUM(CASE WHEN cache_status = 'MISS' THEN 1 ELSE 0 END) as misses,
          COUNT(*) as total
        FROM api_logs
        WHERE ${timeFilter}
          AND cache_status IN ('HIT', 'MISS')
      `;
      const cacheStats = await this.db.querySingle(cacheStatsSql);

      // Top endpoints
      const topEndpointsSql = `
        SELECT
          request_path,
          COUNT(*) as requests,
          AVG(response_time_ms) as avg_time
        FROM api_logs
        WHERE ${timeFilter}
        GROUP BY request_path
        ORDER BY requests DESC
        LIMIT 10
      `;
      const topEndpoints = await this.db.query(topEndpointsSql);

      // Status code breakdown
      const statusBreakdownSql = `
        SELECT
          CASE
            WHEN response_status >= 200 AND response_status < 300 THEN '2xx'
            WHEN response_status >= 400 AND response_status < 500 THEN '4xx'
            WHEN response_status >= 500 THEN '5xx'
            ELSE 'other'
          END as status_group,
          COUNT(*) as count
        FROM api_logs
        WHERE ${timeFilter}
        GROUP BY status_group
      `;
      const statusBreakdown = await this.db.query(statusBreakdownSql);

      const cacheHitRate = cacheStats.result?.total > 0
        ? ((cacheStats.result.hits / cacheStats.result.total) * 100).toFixed(2)
        : 0;

      return {
        success: true,
        timeRange,
        overview: {
          totalRequests: totalRequests.result?.total || 0,
          uniqueVisitors: uniqueVisitors.result?.total || 0,
          cacheHitRate: parseFloat(cacheHitRate),
          cacheHits: cacheStats.result?.hits || 0,
          cacheMisses: cacheStats.result?.misses || 0
        },
        topEndpoints: topEndpoints.results || [],
        statusBreakdown: statusBreakdown.results || []
      };
    } catch (error) {
      console.error('Analytics: Failed to get dashboard:', error);
      throw error;
    }
  }

  /**
   * Get trending datasets
   * @param {number} limit - Number of results
   * @returns {Promise<Object>} Trending datasets
   */
  async getTrending(limit = 10) {
    try {
      const sql = `
        SELECT *
        FROM v_trending_datasets
        LIMIT ?
      `;

      const result = await this.db.query(sql, [limit]);

      return {
        success: true,
        data: result.results || [],
        total: result.results?.length || 0
      };
    } catch (error) {
      console.error('Analytics: Failed to get trending:', error);
      throw error;
    }
  }

  /**
   * Get popular search terms
   * @param {number} limit - Number of results
   * @returns {Promise<Object>} Popular searches
   */
  async getPopularSearches(limit = 20) {
    try {
      const sql = `
        SELECT *
        FROM v_popular_searches
        LIMIT ?
      `;

      const result = await this.db.query(sql, [limit]);

      return {
        success: true,
        data: result.results || [],
        total: result.results?.length || 0
      };
    } catch (error) {
      console.error('Analytics: Failed to get popular searches:', error);
      throw error;
    }
  }

  /**
   * Get traffic overview
   * @param {string} timeRange - Time range
   * @returns {Promise<Object>} Traffic data
   */
  async getTrafficOverview(timeRange = '24h') {
    try {
      const sql = `
        SELECT * FROM v_traffic_overview
      `;

      const result = await this.db.query(sql);

      return {
        success: true,
        timeRange,
        data: result.results || [],
        total: result.results?.length || 0
      };
    } catch (error) {
      console.error('Analytics: Failed to get traffic:', error);
      throw error;
    }
  }

  /**
   * Get performance metrics
   * @param {string} timeRange - Time range
   * @returns {Promise<Object>} Performance data
   */
  async getPerformanceMetrics(timeRange = '24h') {
    const timeFilter = this.getTimeFilter(timeRange);

    try {
      const sql = `
        SELECT
          request_path,
          COUNT(*) as request_count,
          AVG(response_time_ms) as avg_time,
          MIN(response_time_ms) as min_time,
          MAX(response_time_ms) as max_time,
          ROUND(AVG(response_time_ms), 2) as p50,
          MAX(CASE WHEN response_status >= 400 THEN 1 ELSE 0 END) as has_errors
        FROM api_logs
        WHERE ${timeFilter}
          AND response_time_ms IS NOT NULL
        GROUP BY request_path
        ORDER BY avg_time DESC
      `;

      const result = await this.db.query(sql);

      return {
        success: true,
        timeRange,
        data: result.results || [],
        total: result.results?.length || 0
      };
    } catch (error) {
      console.error('Analytics: Failed to get performance:', error);
      throw error;
    }
  }

  /**
   * Get geographic distribution
   * @param {string} timeRange - Time range
   * @returns {Promise<Object>} Geographic data
   */
  async getGeographicDistribution(timeRange = '24h') {
    const timeFilter = this.getTimeFilter(timeRange);

    try {
      const sql = `
        SELECT
          client_country as country,
          COUNT(*) as request_count,
          COUNT(DISTINCT client_ip) as unique_visitors
        FROM api_logs
        WHERE ${timeFilter}
          AND client_country IS NOT NULL
        GROUP BY client_country
        ORDER BY request_count DESC
        LIMIT 20
      `;

      const result = await this.db.query(sql);

      return {
        success: true,
        timeRange,
        data: result.results || [],
        total: result.results?.length || 0
      };
    } catch (error) {
      console.error('Analytics: Failed to get geographic distribution:', error);
      throw error;
    }
  }

  /**
   * Helper: Get SQL time filter based on range
   * @param {string} timeRange - Time range
   * @returns {string} SQL WHERE clause
   */
  getTimeFilter(timeRange) {
    switch (timeRange) {
      case '1h':
        return "created_at >= datetime('now', '-1 hour')";
      case '24h':
        return "created_at >= datetime('now', '-24 hours')";
      case '7d':
        return "created_at >= datetime('now', '-7 days')";
      case '30d':
        return "created_at >= datetime('now', '-30 days')";
      case 'all':
        return '1=1';
      default:
        return "created_at >= datetime('now', '-24 hours')";
    }
  }
}

/**
 * Create analytics service instance
 * @param {Object} dbService - Database service
 * @returns {AnalyticsService} Analytics service
 */
export function createAnalyticsService(dbService) {
  return new AnalyticsService(dbService);
}

export default AnalyticsService;
