// Rate Limiter Service
// Implements sliding window rate limiting using D1 database

import { generateId, getCurrentTimestamp } from './db.js';

/**
 * Rate Limiter Configuration
 */
const RATE_LIMIT_CONFIG = {
  // Default limits
  default: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 100
  },

  // Endpoint-specific limits
  endpoints: {
    '/api/v1/datasets/search': {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 30
    },
    '/api/v1/datasets': {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 60
    },
    '/api/v1/reflexion/process': {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 10 // AI endpoints are expensive
    }
  }
};

/**
 * Rate Limiter Service
 */
export class RateLimiterService {
  constructor(dbService) {
    if (!dbService) {
      throw new Error('Database service is required for rate limiting');
    }
    this.db = dbService;
  }

  /**
   * Get rate limit configuration for a specific endpoint
   * @param {string} path - Request path
   * @returns {Object} Rate limit config
   */
  getConfig(path) {
    // Check for endpoint-specific config
    for (const [endpoint, config] of Object.entries(RATE_LIMIT_CONFIG.endpoints)) {
      if (path.startsWith(endpoint)) {
        return config;
      }
    }

    // Return default config
    return RATE_LIMIT_CONFIG.default;
  }

  /**
   * Check if request should be rate limited
   * @param {string} clientIp - Client IP address
   * @param {string} path - Request path
   * @returns {Promise<Object>} Rate limit result
   */
  async checkRateLimit(clientIp, path) {
    try {
      const config = this.getConfig(path);
      const now = Date.now();
      const windowStart = now - config.windowMs;
      const identifier = `${clientIp}:${path}`;

      // Clean up old records (older than window)
      await this.cleanup(windowStart);

      // Count requests in current window
      const countSql = `
        SELECT COUNT(*) as count
        FROM rate_limits
        WHERE identifier = ?
        AND timestamp >= ?
      `;
      const countResult = await this.db.querySingle(countSql, [identifier, windowStart]);
      const currentCount = countResult.result?.count || 0;

      // Check if limit exceeded
      const isLimited = currentCount >= config.maxRequests;
      const remaining = Math.max(0, config.maxRequests - currentCount);
      const resetTime = now + config.windowMs;

      // Log this request
      if (!isLimited) {
        await this.logRequest(identifier, now);
      }

      return {
        success: true,
        allowed: !isLimited,
        limit: config.maxRequests,
        remaining: isLimited ? 0 : remaining - 1, // -1 for current request
        reset: resetTime,
        retryAfter: isLimited ? Math.ceil(config.windowMs / 1000) : null
      };
    } catch (error) {
      console.error('Rate limit check error:', error);
      // Fail open - allow request if rate limiting fails
      return {
        success: false,
        allowed: true,
        error: error.message
      };
    }
  }

  /**
   * Log a request to rate_limits table
   * @param {string} identifier - Client identifier
   * @param {number} timestamp - Request timestamp
   * @returns {Promise<void>}
   */
  async logRequest(identifier, timestamp) {
    try {
      await this.db.insert('rate_limits', {
        id: generateId(),
        identifier: identifier,
        timestamp: timestamp,
        created_at: getCurrentTimestamp()
      });
    } catch (error) {
      console.error('Error logging rate limit request:', error);
      // Don't throw - rate limiting should fail open
    }
  }

  /**
   * Clean up old rate limit records
   * @param {number} windowStart - Timestamp before which to delete
   * @returns {Promise<void>}
   */
  async cleanup(windowStart) {
    try {
      // Delete records older than the longest window
      const oldestWindow = windowStart - (24 * 60 * 60 * 1000); // Keep 24 hours for analytics

      const deleteSql = `
        DELETE FROM rate_limits
        WHERE timestamp < ?
      `;
      await this.db.query(deleteSql, [oldestWindow]);
    } catch (error) {
      console.error('Error cleaning up rate limits:', error);
      // Don't throw - cleanup is non-critical
    }
  }

  /**
   * Get rate limit statistics
   * @param {string} clientIp - Optional client IP filter
   * @returns {Promise<Object>} Statistics
   */
  async getStats(clientIp = null) {
    try {
      const now = Date.now();
      const hourAgo = now - (60 * 60 * 1000);

      let sql = `
        SELECT
          identifier,
          COUNT(*) as request_count,
          MIN(timestamp) as first_request,
          MAX(timestamp) as last_request
        FROM rate_limits
        WHERE timestamp >= ?
      `;
      const params = [hourAgo];

      if (clientIp) {
        sql += ' AND identifier LIKE ?';
        params.push(`${clientIp}:%`);
      }

      sql += ' GROUP BY identifier ORDER BY request_count DESC LIMIT 100';

      const result = await this.db.query(sql, params);

      return {
        success: true,
        stats: result.results,
        window: '1 hour',
        timestamp: new Date(now).toISOString()
      };
    } catch (error) {
      console.error('Error fetching rate limit stats:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Reset rate limits for a specific identifier
   * @param {string} identifier - Identifier to reset
   * @returns {Promise<Object>} Result
   */
  async resetLimit(identifier) {
    try {
      const deleteSql = `
        DELETE FROM rate_limits
        WHERE identifier = ?
      `;
      await this.db.query(deleteSql, [identifier]);

      return {
        success: true,
        message: `Rate limit reset for ${identifier}`
      };
    } catch (error) {
      console.error('Error resetting rate limit:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

/**
 * Create rate limiter service instance
 * @param {DatabaseService} dbService - Database service
 * @returns {RateLimiterService} Rate limiter service
 */
export function createRateLimiterService(dbService) {
  return new RateLimiterService(dbService);
}

export default RateLimiterService;
