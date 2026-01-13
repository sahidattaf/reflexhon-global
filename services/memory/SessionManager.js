import { logger } from '../../utils/logger.js';

/**
 * Session Manager
 *
 * Manages user sessions for conversation continuity.
 * Tracks session state, preferences, and metadata.
 *
 * Features:
 * - Generate unique session IDs
 * - Track session start/end times
 * - Store session preferences
 * - Link sessions to users (future)
 * - Session expiration handling
 * - Active session tracking
 *
 * Database Schema (D1):
 * CREATE TABLE sessions (
 *   id TEXT PRIMARY KEY,
 *   user_id TEXT,              -- Optional user identifier
 *   started_at INTEGER NOT NULL,
 *   last_activity INTEGER NOT NULL,
 *   ended_at INTEGER,
 *   preferences TEXT,          -- JSON
 *   metadata TEXT,             -- JSON
 *   is_active INTEGER DEFAULT 1
 * );
 */
class SessionManager {
  constructor(dbService = null) {
    this.db = dbService;
    this.sessionTimeout = 30 * 60 * 1000; // 30 minutes in milliseconds
    this.activeSessions = new Map(); // In-memory cache
  }

  /**
   * Initialize with database service
   *
   * @param {Object} dbService - Database service instance
   */
  initialize(dbService) {
    this.db = dbService;
    logger.info('SessionManager initialized with database');
  }

  /**
   * Create a new session
   *
   * @param {Object} options - Session options
   * @returns {Promise<Object>} Session info
   */
  async createSession(options = {}) {
    const startTime = Date.now();
    const sessionId = this._generateSessionId();

    logger.info('Creating new session', { session_id: sessionId });

    try {
      const sessionData = {
        id: sessionId,
        user_id: options.user_id || null,
        started_at: startTime,
        last_activity: startTime,
        ended_at: null,
        preferences: options.preferences ? JSON.stringify(options.preferences) : null,
        metadata: options.metadata ? JSON.stringify(options.metadata) : null,
        is_active: 1
      };

      // Store in database if available
      if (this.db) {
        await this.db.insert('sessions', sessionData);
      }

      // Cache in memory
      this.activeSessions.set(sessionId, {
        ...sessionData,
        preferences: options.preferences || {},
        metadata: options.metadata || {}
      });

      logger.info('Session created', {
        session_id: sessionId,
        user_id: options.user_id || 'anonymous'
      });

      return {
        success: true,
        session_id: sessionId,
        started_at: startTime,
        preferences: options.preferences || {},
        metadata: options.metadata || {}
      };
    } catch (error) {
      logger.error('Failed to create session', {
        error: error.message,
        session_id: sessionId
      });

      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get session information
   *
   * @param {string} sessionId - Session ID
   * @returns {Promise<Object>} Session info
   */
  async getSession(sessionId) {
    logger.debug('Getting session', { session_id: sessionId });

    try {
      // Check cache first
      if (this.activeSessions.has(sessionId)) {
        const cached = this.activeSessions.get(sessionId);

        // Check if expired
        if (this._isSessionExpired(cached)) {
          await this.endSession(sessionId);
          return {
            success: false,
            error: 'Session expired'
          };
        }

        return {
          success: true,
          session: cached
        };
      }

      // Check database
      if (this.db) {
        const sql = 'SELECT * FROM sessions WHERE id = ? AND is_active = 1';
        const result = await this.db.query(sql, [sessionId]);

        if (result.results.length > 0) {
          const row = result.results[0];
          const session = {
            id: row.id,
            user_id: row.user_id,
            started_at: row.started_at,
            last_activity: row.last_activity,
            ended_at: row.ended_at,
            preferences: row.preferences ? JSON.parse(row.preferences) : {},
            metadata: row.metadata ? JSON.parse(row.metadata) : {},
            is_active: row.is_active
          };

          // Check if expired
          if (this._isSessionExpired(session)) {
            await this.endSession(sessionId);
            return {
              success: false,
              error: 'Session expired'
            };
          }

          // Cache for future use
          this.activeSessions.set(sessionId, session);

          return {
            success: true,
            session
          };
        }
      }

      return {
        success: false,
        error: 'Session not found'
      };
    } catch (error) {
      logger.error('Failed to get session', {
        error: error.message,
        session_id: sessionId
      });

      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update session activity
   *
   * @param {string} sessionId - Session ID
   * @returns {Promise<Object>} Result
   */
  async updateActivity(sessionId) {
    const timestamp = Date.now();

    logger.debug('Updating session activity', { session_id: sessionId });

    try {
      // Update cache
      if (this.activeSessions.has(sessionId)) {
        const session = this.activeSessions.get(sessionId);
        session.last_activity = timestamp;
        this.activeSessions.set(sessionId, session);
      }

      // Update database
      if (this.db) {
        const sql = 'UPDATE sessions SET last_activity = ? WHERE id = ?';
        await this.db.query(sql, [timestamp, sessionId]);
      }

      return {
        success: true,
        session_id: sessionId,
        last_activity: timestamp
      };
    } catch (error) {
      logger.error('Failed to update activity', {
        error: error.message,
        session_id: sessionId
      });

      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update session preferences
   *
   * @param {string} sessionId - Session ID
   * @param {Object} preferences - Preferences to update
   * @returns {Promise<Object>} Result
   */
  async updatePreferences(sessionId, preferences) {
    logger.info('Updating session preferences', {
      session_id: sessionId,
      preference_count: Object.keys(preferences).length
    });

    try {
      // Get current session
      const sessionResult = await this.getSession(sessionId);
      if (!sessionResult.success) {
        return sessionResult;
      }

      // Merge preferences
      const currentPreferences = sessionResult.session.preferences || {};
      const mergedPreferences = { ...currentPreferences, ...preferences };

      // Update cache
      if (this.activeSessions.has(sessionId)) {
        const session = this.activeSessions.get(sessionId);
        session.preferences = mergedPreferences;
        this.activeSessions.set(sessionId, session);
      }

      // Update database
      if (this.db) {
        const sql = 'UPDATE sessions SET preferences = ? WHERE id = ?';
        await this.db.query(sql, [JSON.stringify(mergedPreferences), sessionId]);
      }

      logger.info('Preferences updated', { session_id: sessionId });

      return {
        success: true,
        session_id: sessionId,
        preferences: mergedPreferences
      };
    } catch (error) {
      logger.error('Failed to update preferences', {
        error: error.message,
        session_id: sessionId
      });

      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * End a session
   *
   * @param {string} sessionId - Session ID
   * @returns {Promise<Object>} Result
   */
  async endSession(sessionId) {
    const timestamp = Date.now();

    logger.info('Ending session', { session_id: sessionId });

    try {
      // Update cache
      if (this.activeSessions.has(sessionId)) {
        const session = this.activeSessions.get(sessionId);
        session.ended_at = timestamp;
        session.is_active = 0;
        this.activeSessions.set(sessionId, session);

        // Remove from active sessions after delay
        setTimeout(() => {
          this.activeSessions.delete(sessionId);
        }, 5000);
      }

      // Update database
      if (this.db) {
        const sql = 'UPDATE sessions SET ended_at = ?, is_active = 0 WHERE id = ?';
        await this.db.query(sql, [timestamp, sessionId]);
      }

      logger.info('Session ended', { session_id: sessionId });

      return {
        success: true,
        session_id: sessionId,
        ended_at: timestamp
      };
    } catch (error) {
      logger.error('Failed to end session', {
        error: error.message,
        session_id: sessionId
      });

      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Clean up expired sessions
   *
   * @returns {Promise<Object>} Result
   */
  async cleanupExpiredSessions() {
    logger.info('Cleaning up expired sessions');

    try {
      const expiredTime = Date.now() - this.sessionTimeout;
      let cleanedCount = 0;

      // Clean from cache
      for (const [sessionId, session] of this.activeSessions.entries()) {
        if (session.last_activity < expiredTime) {
          await this.endSession(sessionId);
          cleanedCount++;
        }
      }

      // Clean from database
      if (this.db) {
        const sql = `
          UPDATE sessions
          SET is_active = 0, ended_at = ?
          WHERE last_activity < ? AND is_active = 1
        `;
        await this.db.query(sql, [Date.now(), expiredTime]);
      }

      logger.info('Cleanup complete', { cleaned_count: cleanedCount });

      return {
        success: true,
        cleaned_count: cleanedCount
      };
    } catch (error) {
      logger.error('Failed to cleanup sessions', { error: error.message });

      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get active sessions count
   *
   * @returns {number} Count
   */
  getActiveSessionsCount() {
    return this.activeSessions.size;
  }

  /**
   * Get session statistics
   *
   * @returns {Object} Statistics
   */
  getStats() {
    return {
      active_sessions: this.activeSessions.size,
      session_timeout_minutes: this.sessionTimeout / 60000,
      database_enabled: this.db !== null
    };
  }

  // ===== PRIVATE METHODS =====

  /**
   * Generate unique session ID
   */
  _generateSessionId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 15);
    return `sess_${timestamp}_${random}`;
  }

  /**
   * Check if session is expired
   */
  _isSessionExpired(session) {
    const now = Date.now();
    const timeSinceActivity = now - session.last_activity;
    return timeSinceActivity > this.sessionTimeout;
  }
}

// Export singleton instance
export default new SessionManager();
