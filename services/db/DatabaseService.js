/**
 * DatabaseService - D1 Database Interface (Existing Schema)
 * Integrated with existing reflexhon_global database
 *
 * Existing Tables:
 * - cultural_datasets (70 entries with FTS5 full-text search)
 * - reflexion_history (conversation history)
 * - api_logs (request logging)
 * - user_sessions (session tracking)
 * - api_keys (API key management)
 * - rate_limits (rate limiting)
 * - cultural_feedback (user feedback)
 * - search_analytics (search tracking)
 */

class DatabaseService {
  constructor() {
    this.db = null;
  }

  /**
   * Initialize the database connection
   * @param {D1Database} db - Cloudflare D1 database binding
   */
  initialize(db) {
    this.db = db;
  }

  /**
   * Check if database is initialized
   */
  isInitialized() {
    return this.db !== null;
  }

  // ================================================================
  // CULTURAL DATASETS - With FTS5 Full-Text Search
  // ================================================================

  /**
   * Get all cultural datasets
   * @param {Object} filters - Optional filters (category, language)
   * @returns {Promise<Array>} Array of datasets
   */
  async getAllDatasets(filters = {}) {
    if (!this.db) throw new Error('Database not initialized');

    let query = 'SELECT * FROM cultural_datasets';
    const conditions = [];
    const params = [];

    if (filters.category) {
      conditions.push('category = ?');
      params.push(filters.category);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY id';

    const result = await this.db.prepare(query).bind(...params).all();
    return result.results || [];
  }

  /**
   * Search datasets using FTS5 full-text search
   * @param {string} searchText - Text to search for
   * @param {number} limit - Maximum results (default 10)
   * @returns {Promise<Array>} Matching datasets
   */
  async searchDatasets(searchText, limit = 10) {
    if (!this.db) throw new Error('Database not initialized');

    // Use FTS5 full-text search for better performance
    const result = await this.db.prepare(`
      SELECT d.*, fts.rank
      FROM cultural_datasets d
      JOIN cultural_datasets_fts fts ON d.id = fts.id
      WHERE cultural_datasets_fts MATCH ?
      ORDER BY fts.rank
      LIMIT ?
    `).bind(searchText, limit).all();

    // Fallback to LIKE search if FTS fails
    if (!result.results || result.results.length === 0) {
      const fallbackResult = await this.db.prepare(`
        SELECT *,
          CASE
            WHEN LOWER(input) = LOWER(?) THEN 100
            WHEN LOWER(input) LIKE '%' || LOWER(?) || '%' THEN 80
            WHEN LOWER(output) LIKE '%' || LOWER(?) || '%' THEN 60
            ELSE 40
          END as match_score
        FROM cultural_datasets
        WHERE LOWER(input) LIKE '%' || LOWER(?) || '%'
           OR LOWER(output) LIKE '%' || LOWER(?) || '%'
        ORDER BY match_score DESC
        LIMIT ?
      `).bind(searchText, searchText, searchText, searchText, searchText, limit).all();

      return fallbackResult.results || [];
    }

    return result.results || [];
  }

  /**
   * Get a single dataset by ID
   * @param {string} id - Dataset ID
   * @returns {Promise<Object|null>} Dataset or null
   */
  async getDatasetById(id) {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.prepare(
      'SELECT * FROM cultural_datasets WHERE id = ?'
    ).bind(id).first();

    return result;
  }

  /**
   * Get datasets by category
   * @param {string} category - Category name
   * @returns {Promise<Array>} Datasets in category
   */
  async getDatasetsByCategory(category) {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.prepare(
      'SELECT * FROM cultural_datasets WHERE category = ? ORDER BY id'
    ).bind(category).all();

    return result.results || [];
  }

  // ================================================================
  // REFLEXION HISTORY - Conversation Tracking
  // ================================================================

  /**
   * Store reflexion history entry
   * @param {Object} entry - History entry
   * @returns {Promise<number>} Entry ID
   */
  async storeReflexionHistory(entry) {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.prepare(`
      INSERT INTO reflexion_history (
        session_id, user_input, ai_response, metadata, created_at
      ) VALUES (?, ?, ?, ?, datetime('now'))
    `).bind(
      entry.session_id || null,
      entry.user_input,
      entry.ai_response,
      JSON.stringify(entry.metadata || {}),
    ).run();

    return result.meta.last_row_id;
  }

  /**
   * Get reflexion history for a session
   * @param {string} sessionId - Session ID
   * @param {number} limit - Maximum entries (default 50)
   * @returns {Promise<Array>} History entries
   */
  async getReflexionHistory(sessionId, limit = 50) {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.prepare(`
      SELECT * FROM reflexion_history
      WHERE session_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `).bind(sessionId, limit).all();

    return (result.results || []).reverse(); // Oldest first
  }

  /**
   * Get all reflexion history (for analytics)
   * @param {number} hours - Last N hours (default 24)
   * @returns {Promise<Array>} History entries
   */
  async getRecentReflexionHistory(hours = 24) {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.prepare(`
      SELECT * FROM reflexion_history
      WHERE created_at >= datetime('now', '-' || ? || ' hours')
      ORDER BY created_at DESC
    `).bind(hours).all();

    return result.results || [];
  }

  // ================================================================
  // USER SESSIONS - Session Management
  // ================================================================

  /**
   * Create or update session
   * @param {string} sessionId - Session ID
   * @param {Object} metadata - Session metadata
   * @returns {Promise<Object>} Session object
   */
  async createOrUpdateSession(sessionId, metadata = {}) {
    if (!this.db) throw new Error('Database not initialized');

    // Try to get existing session
    let session = await this.db.prepare(
      'SELECT * FROM user_sessions WHERE session_id = ?'
    ).bind(sessionId).first();

    if (session) {
      // Update existing session
      await this.db.prepare(`
        UPDATE user_sessions
        SET last_activity = datetime('now'),
            metadata = ?
        WHERE session_id = ?
      `).bind(JSON.stringify(metadata), sessionId).run();
    } else {
      // Create new session
      await this.db.prepare(`
        INSERT INTO user_sessions (session_id, metadata, created_at, last_activity)
        VALUES (?, ?, datetime('now'), datetime('now'))
      `).bind(sessionId, JSON.stringify(metadata)).run();
    }

    return await this.db.prepare(
      'SELECT * FROM user_sessions WHERE session_id = ?'
    ).bind(sessionId).first();
  }

  /**
   * Get session by ID
   * @param {string} sessionId - Session ID
   * @returns {Promise<Object|null>} Session or null
   */
  async getSession(sessionId) {
    if (!this.db) throw new Error('Database not initialized');

    return await this.db.prepare(
      'SELECT * FROM user_sessions WHERE session_id = ?'
    ).bind(sessionId).first();
  }

  /**
   * Get active sessions count
   * @param {number} hours - Consider active if activity within N hours (default 24)
   * @returns {Promise<number>} Active session count
   */
  async getActiveSessionsCount(hours = 24) {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.prepare(`
      SELECT COUNT(*) as count FROM user_sessions
      WHERE last_activity >= datetime('now', '-' || ? || ' hours')
    `).bind(hours).first();

    return result?.count || 0;
  }

  // ================================================================
  // API LOGS - Request Tracking
  // ================================================================

  /**
   * Log API request
   * @param {Object} logEntry - Log entry data
   */
  async logAPIRequest(logEntry) {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.prepare(`
      INSERT INTO api_logs (
        session_id, endpoint, method, status_code, response_time_ms,
        ip_address, user_agent, error_message, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(
      logEntry.session_id || null,
      logEntry.endpoint,
      logEntry.method,
      logEntry.status_code,
      logEntry.response_time_ms || null,
      logEntry.ip_address || null,
      logEntry.user_agent || null,
      logEntry.error_message || null
    ).run();
  }

  /**
   * Get API logs
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Log entries
   */
  async getAPILogs(options = {}) {
    if (!this.db) throw new Error('Database not initialized');

    const hours = options.hours || 24;
    const limit = options.limit || 100;

    const result = await this.db.prepare(`
      SELECT * FROM api_logs
      WHERE created_at >= datetime('now', '-' || ? || ' hours')
      ORDER BY created_at DESC
      LIMIT ?
    `).bind(hours, limit).all();

    return result.results || [];
  }

  /**
   * Get API analytics
   * @param {number} hours - Time range in hours
   * @returns {Promise<Object>} Analytics data
   */
  async getAPIAnalytics(hours = 24) {
    if (!this.db) throw new Error('Database not initialized');

    const stats = await this.db.prepare(`
      SELECT
        COUNT(*) as total_requests,
        COUNT(DISTINCT session_id) as unique_sessions,
        COUNT(DISTINCT ip_address) as unique_visitors,
        AVG(response_time_ms) as avg_response_time,
        SUM(CASE WHEN status_code = 200 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) as success_rate,
        SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) as error_count
      FROM api_logs
      WHERE created_at >= datetime('now', '-' || ? || ' hours')
    `).bind(hours).first();

    return stats || {
      total_requests: 0,
      unique_sessions: 0,
      unique_visitors: 0,
      avg_response_time: 0,
      success_rate: 100,
      error_count: 0
    };
  }

  // ================================================================
  // SEARCH ANALYTICS - Track Search Patterns
  // ================================================================

  /**
   * Track search query
   * @param {Object} searchData - Search tracking data
   */
  async trackSearch(searchData) {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.prepare(`
      INSERT INTO search_analytics (
        session_id, query, results_count, clicked_result_id, created_at
      ) VALUES (?, ?, ?, ?, datetime('now'))
    `).bind(
      searchData.session_id || null,
      searchData.query,
      searchData.results_count || 0,
      searchData.clicked_result_id || null
    ).run();
  }

  /**
   * Get popular search queries
   * @param {number} limit - Maximum results (default 10)
   * @returns {Promise<Array>} Popular queries
   */
  async getPopularSearches(limit = 10) {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.prepare(`
      SELECT query, COUNT(*) as search_count
      FROM search_analytics
      WHERE created_at >= datetime('now', '-7 days')
      GROUP BY query
      ORDER BY search_count DESC
      LIMIT ?
    `).bind(limit).all();

    return result.results || [];
  }

  // ================================================================
  // CULTURAL FEEDBACK - User Feedback Collection
  // ================================================================

  /**
   * Store user feedback
   * @param {Object} feedback - Feedback data
   */
  async storeFeedback(feedback) {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.prepare(`
      INSERT INTO cultural_feedback (
        session_id, reflexion_id, rating, feedback_text, created_at
      ) VALUES (?, ?, ?, ?, datetime('now'))
    `).bind(
      feedback.session_id || null,
      feedback.reflexion_id || null,
      feedback.rating,
      feedback.feedback_text || null
    ).run();
  }

  /**
   * Get average feedback rating
   * @param {number} days - Time range in days (default 7)
   * @returns {Promise<Object>} Feedback stats
   */
  async getFeedbackStats(days = 7) {
    if (!this.db) throw new Error('Database not initialized');

    const stats = await this.db.prepare(`
      SELECT
        AVG(rating) as avg_rating,
        COUNT(*) as total_feedback,
        SUM(CASE WHEN rating >= 4 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) as positive_rate
      FROM cultural_feedback
      WHERE created_at >= datetime('now', '-' || ? || ' days')
    `).bind(days).first();

    return stats || {
      avg_rating: 0,
      total_feedback: 0,
      positive_rate: 0
    };
  }

  // ================================================================
  // COMPREHENSIVE ANALYTICS
  // ================================================================

  /**
   * Get complete dashboard analytics
   * @param {number} hours - Time range in hours
   * @returns {Promise<Object>} Complete analytics
   */
  async getDashboardAnalytics(hours = 24) {
    if (!this.db) throw new Error('Database not initialized');

    const [apiStats, feedbackStats, activeSessions, popularSearches] = await Promise.all([
      this.getAPIAnalytics(hours),
      this.getFeedbackStats(Math.ceil(hours / 24)),
      this.getActiveSessionsCount(hours),
      this.getPopularSearches(5)
    ]);

    return {
      api: apiStats,
      feedback: feedbackStats,
      active_sessions: activeSessions,
      popular_searches: popularSearches,
      time_range_hours: hours
    };
  }

  // ================================================================
  // DATABASE UTILITIES
  // ================================================================

  /**
   * Get database statistics
   * @returns {Promise<Object>} Database stats
   */
  async getDatabaseStats() {
    if (!this.db) throw new Error('Database not initialized');

    const tables = [
      'cultural_datasets',
      'reflexion_history',
      'api_logs',
      'user_sessions',
      'cultural_feedback',
      'search_analytics'
    ];

    const stats = {};

    for (const table of tables) {
      const result = await this.db.prepare(`SELECT COUNT(*) as count FROM ${table}`).first();
      stats[table] = result?.count || 0;
    }

    return stats;
  }

  /**
   * Execute raw SQL query (admin only)
   * @param {string} sql - SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise<Object>} Query result
   */
  async executeRaw(sql, params = []) {
    if (!this.db) throw new Error('Database not initialized');
    return await this.db.prepare(sql).bind(...params).all();
  }
}

// Export singleton instance
export default new DatabaseService();
