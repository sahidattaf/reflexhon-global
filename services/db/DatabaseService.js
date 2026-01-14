/**
 * DatabaseService - D1 Database Interface
 * Phase 2: Data Layer Service
 *
 * Provides a clean interface for all database operations including:
 * - Cultural datasets management
 * - Session & conversation tracking
 * - User preferences & learning
 * - Analytics & logging
 * - Cultural alignment scoring
 */

class DatabaseService {
  constructor() {
    this.db = null; // Will be set by initialize()
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
  // CULTURAL DATASETS
  // ================================================================

  /**
   * Get all cultural datasets
   * @param {Object} filters - Optional filters (category, language, dialect)
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
    if (filters.language) {
      conditions.push('language = ?');
      params.push(filters.language);
    }
    if (filters.dialect) {
      conditions.push('dialect = ?');
      params.push(filters.dialect);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY relevance_score DESC, usage_count DESC';

    const result = await this.db.prepare(query).bind(...params).all();
    return result.results || [];
  }

  /**
   * Search datasets by input text
   * @param {string} searchText - Text to search for
   * @param {number} limit - Maximum results (default 10)
   * @returns {Promise<Array>} Matching datasets
   */
  async searchDatasets(searchText, limit = 10) {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.prepare(`
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
      ORDER BY match_score DESC, relevance_score DESC, usage_count DESC
      LIMIT ?
    `).bind(searchText, searchText, searchText, searchText, searchText, limit).all();

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
   * Create or update a cultural dataset
   * @param {Object} dataset - Dataset object
   * @returns {Promise<Object>} Created/updated dataset
   */
  async upsertDataset(dataset) {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.prepare(`
      INSERT INTO cultural_datasets (
        id, category, input, output, language, dialect,
        cultural_context, keywords, relevance_score
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        category = excluded.category,
        input = excluded.input,
        output = excluded.output,
        language = excluded.language,
        dialect = excluded.dialect,
        cultural_context = excluded.cultural_context,
        keywords = excluded.keywords,
        relevance_score = excluded.relevance_score,
        updated_at = CURRENT_TIMESTAMP
    `).bind(
      dataset.id,
      dataset.category,
      dataset.input,
      dataset.output,
      dataset.language || 'papiamentu',
      dataset.dialect || null,
      dataset.cultural_context || null,
      JSON.stringify(dataset.keywords || []),
      dataset.relevance_score || 1.0
    ).run();

    return await this.getDatasetById(dataset.id);
  }

  /**
   * Track dataset usage
   * @param {string} datasetId - Dataset ID
   * @param {string} sessionId - Session ID
   * @param {number} matchScore - Match score (0-100)
   * @param {string} context - User query context
   */
  async trackDatasetUsage(datasetId, sessionId, matchScore, context) {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.prepare(`
      INSERT INTO dataset_usage_stats (dataset_id, session_id, match_score, context)
      VALUES (?, ?, ?, ?)
    `).bind(datasetId, sessionId, matchScore, context).run();
  }

  // ================================================================
  // SESSIONS
  // ================================================================

  /**
   * Create or get session
   * @param {string} sessionId - Session ID
   * @param {Object} metadata - Session metadata (ip, user_agent, etc.)
   * @returns {Promise<Object>} Session object
   */
  async createOrGetSession(sessionId, metadata = {}) {
    if (!this.db) throw new Error('Database not initialized');

    // Try to get existing session
    let session = await this.db.prepare(
      'SELECT * FROM sessions WHERE session_id = ?'
    ).bind(sessionId).first();

    if (session) {
      // Update last activity
      await this.db.prepare(`
        UPDATE sessions
        SET last_activity_at = CURRENT_TIMESTAMP
        WHERE session_id = ?
      `).bind(sessionId).run();

      return session;
    }

    // Create new session
    await this.db.prepare(`
      INSERT INTO sessions (
        session_id, ip_address, user_agent, language_preference,
        dialect_preference, metadata
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      sessionId,
      metadata.ip || null,
      metadata.user_agent || null,
      metadata.language_preference || 'papiamentu',
      metadata.dialect_preference || null,
      JSON.stringify(metadata)
    ).run();

    return await this.db.prepare(
      'SELECT * FROM sessions WHERE session_id = ?'
    ).bind(sessionId).first();
  }

  /**
   * Get session statistics
   * @param {string} sessionId - Session ID
   * @returns {Promise<Object>} Session stats
   */
  async getSessionStats(sessionId) {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.prepare(`
      SELECT * FROM v_session_quality WHERE session_id = ?
    `).bind(sessionId).first();

    return result;
  }

  // ================================================================
  // CONVERSATION MESSAGES
  // ================================================================

  /**
   * Store a conversation message
   * @param {string} sessionId - Session ID
   * @param {Object} message - Message object
   * @returns {Promise<number>} Message ID
   */
  async storeMessage(sessionId, message) {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.prepare(`
      INSERT INTO conversation_messages (
        session_id, role, content, language, dialect, emotion, intent,
        confidence, cultural_score, matched_dataset_id, processing_time_ms
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      sessionId,
      message.role,
      message.content,
      message.language || null,
      message.dialect || null,
      message.emotion || null,
      message.intent || null,
      message.confidence || null,
      message.cultural_score || null,
      message.matched_dataset_id || null,
      message.processing_time_ms || null
    ).run();

    return result.meta.last_row_id;
  }

  /**
   * Get conversation history for a session
   * @param {string} sessionId - Session ID
   * @param {number} limit - Maximum messages to retrieve
   * @returns {Promise<Array>} Array of messages
   */
  async getConversationHistory(sessionId, limit = 50) {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.prepare(`
      SELECT * FROM conversation_messages
      WHERE session_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `).bind(sessionId, limit).all();

    return (result.results || []).reverse(); // Oldest first
  }

  // ================================================================
  // USER PREFERENCES & LEARNING
  // ================================================================

  /**
   * Store or update a user preference
   * @param {string} sessionId - Session ID
   * @param {string} key - Preference key
   * @param {string} value - Preference value
   * @param {Object} options - Additional options (confidence, learned_from)
   */
  async setPreference(sessionId, key, value, options = {}) {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.prepare(`
      INSERT INTO user_preferences (
        session_id, preference_key, preference_value, confidence, learned_from
      ) VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(session_id, preference_key) DO UPDATE SET
        preference_value = excluded.preference_value,
        confidence = excluded.confidence,
        occurrence_count = occurrence_count + 1,
        updated_at = CURRENT_TIMESTAMP
    `).bind(
      sessionId,
      key,
      value,
      options.confidence || 0.5,
      options.learned_from || 'implicit'
    ).run();
  }

  /**
   * Get all preferences for a session
   * @param {string} sessionId - Session ID
   * @returns {Promise<Object>} Preferences object
   */
  async getPreferences(sessionId) {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.prepare(`
      SELECT preference_key, preference_value, confidence
      FROM user_preferences
      WHERE session_id = ?
    `).bind(sessionId).all();

    const preferences = {};
    (result.results || []).forEach(pref => {
      preferences[pref.preference_key] = {
        value: pref.preference_value,
        confidence: pref.confidence
      };
    });

    return preferences;
  }

  // ================================================================
  // ANALYTICS & LOGGING
  // ================================================================

  /**
   * Log an API request
   * @param {Object} requestData - Request data
   */
  async logRequest(requestData) {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.prepare(`
      INSERT INTO analytics_requests (
        session_id, path, method, status_code, response_time_ms,
        ip_address, user_agent, language, error_message
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      requestData.session_id || null,
      requestData.path,
      requestData.method,
      requestData.status_code,
      requestData.response_time_ms || null,
      requestData.ip_address || null,
      requestData.user_agent || null,
      requestData.language || null,
      requestData.error_message || null
    ).run();
  }

  /**
   * Get analytics data
   * @param {Object} options - Query options (range, groupBy, etc.)
   * @returns {Promise<Object>} Analytics data
   */
  async getAnalytics(options = {}) {
    if (!this.db) throw new Error('Database not initialized');

    const range = options.range || 24; // hours

    // Get basic stats
    const stats = await this.db.prepare(`
      SELECT
        COUNT(*) as total_requests,
        COUNT(DISTINCT session_id) as unique_sessions,
        COUNT(DISTINCT ip_address) as unique_visitors,
        AVG(response_time_ms) as avg_response_time,
        SUM(CASE WHEN status_code = 200 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) as success_rate
      FROM analytics_requests
      WHERE created_at >= datetime('now', '-' || ? || ' hours')
    `).bind(range).first();

    // Get daily stats
    const dailyStats = await this.db.prepare(`
      SELECT * FROM v_daily_stats
      ORDER BY date DESC
      LIMIT 30
    `).all();

    // Get popular datasets
    const popularDatasets = await this.db.prepare(`
      SELECT * FROM v_popular_datasets
      LIMIT 10
    `).all();

    return {
      current_stats: stats,
      daily_breakdown: dailyStats.results || [],
      popular_datasets: popularDatasets.results || []
    };
  }

  // ================================================================
  // CULTURAL ALIGNMENT SCORING
  // ================================================================

  /**
   * Store cultural alignment score
   * @param {number} messageId - Message ID
   * @param {Object} scores - Scoring data
   */
  async storeCulturalScore(messageId, scores) {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.prepare(`
      INSERT INTO cultural_alignment_scores (
        message_id, overall_score, quality_grade,
        language_appropriateness, cultural_sensitivity, contextual_relevance,
        respectfulness, empathy_level, warmth_factor, dialect_accuracy,
        code_switching_quality, cultural_context_depth, authenticity,
        strengths, recommendations
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      messageId,
      scores.overall_score,
      scores.quality_grade,
      scores.dimension_scores?.language_appropriateness || 0,
      scores.dimension_scores?.cultural_sensitivity || 0,
      scores.dimension_scores?.contextual_relevance || 0,
      scores.dimension_scores?.respectfulness || 0,
      scores.dimension_scores?.empathy_level || 0,
      scores.dimension_scores?.warmth_factor || 0,
      scores.dimension_scores?.dialect_accuracy || 0,
      scores.dimension_scores?.code_switching_quality || 0,
      scores.dimension_scores?.cultural_context_depth || 0,
      scores.dimension_scores?.authenticity || 0,
      JSON.stringify(scores.strengths || []),
      JSON.stringify(scores.recommendations || [])
    ).run();
  }

  /**
   * Get average cultural scores over time
   * @param {number} days - Number of days to analyze
   * @returns {Promise<Object>} Average scores
   */
  async getCulturalScoreTrends(days = 7) {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.prepare(`
      SELECT
        DATE(cas.created_at) as date,
        AVG(cas.overall_score) as avg_overall_score,
        AVG(cas.language_appropriateness) as avg_language,
        AVG(cas.cultural_sensitivity) as avg_cultural_sensitivity,
        AVG(cas.warmth_factor) as avg_warmth,
        COUNT(*) as sample_size
      FROM cultural_alignment_scores cas
      WHERE cas.created_at >= datetime('now', '-' || ? || ' days')
      GROUP BY DATE(cas.created_at)
      ORDER BY date DESC
    `).bind(days).all();

    return result.results || [];
  }

  // ================================================================
  // UTILITY METHODS
  // ================================================================

  /**
   * Execute a raw SQL query (for migrations, admin tasks)
   * @param {string} sql - SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise<Object>} Query result
   */
  async executeRaw(sql, params = []) {
    if (!this.db) throw new Error('Database not initialized');

    return await this.db.prepare(sql).bind(...params).run();
  }

  /**
   * Execute a batch of statements
   * @param {Array<Object>} statements - Array of {sql, params}
   * @returns {Promise<Array>} Results
   */
  async executeBatch(statements) {
    if (!this.db) throw new Error('Database not initialized');

    const batch = statements.map(stmt =>
      this.db.prepare(stmt.sql).bind(...(stmt.params || []))
    );

    return await this.db.batch(batch);
  }

  /**
   * Get database statistics
   * @returns {Promise<Object>} Database stats
   */
  async getDatabaseStats() {
    if (!this.db) throw new Error('Database not initialized');

    const stats = {};

    // Count records in each table
    const tables = [
      'cultural_datasets',
      'sessions',
      'conversation_messages',
      'user_preferences',
      'analytics_requests',
      'cultural_alignment_scores'
    ];

    for (const table of tables) {
      const result = await this.db.prepare(`SELECT COUNT(*) as count FROM ${table}`).first();
      stats[table] = result.count;
    }

    return stats;
  }
}

// Export singleton instance
export default new DatabaseService();
