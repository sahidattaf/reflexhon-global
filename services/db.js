// Database Service - Cloudflare D1 Integration
// Handles all database operations for Reflexhon Global

/**
 * Database Service Class
 * Provides CRUD operations and utilities for Cloudflare D1 database
 */
export class DatabaseService {
  constructor(db) {
    if (!db) {
      throw new Error('Database binding (DB) is required');
    }
    this.db = db;
  }

  /**
   * Execute a single SQL query
   * @param {string} sql - SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise<Object>} Query result
   */
  async query(sql, params = []) {
    try {
      const result = await this.db.prepare(sql).bind(...params).all();
      return {
        success: true,
        results: result.results || [],
        meta: result.meta || {}
      };
    } catch (error) {
      console.error('Database query error:', error);
      return {
        success: false,
        error: error.message,
        results: []
      };
    }
  }

  /**
   * Execute a single SQL query and return first result
   * @param {string} sql - SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise<Object>} First row or null
   */
  async querySingle(sql, params = []) {
    try {
      const result = await this.db.prepare(sql).bind(...params).first();
      return {
        success: true,
        result: result
      };
    } catch (error) {
      console.error('Database query error:', error);
      return {
        success: false,
        error: error.message,
        result: null
      };
    }
  }

  /**
   * Execute multiple SQL statements in a batch
   * @param {Array<{sql: string, params: Array}>} statements
   * @returns {Promise<Object>} Batch result
   */
  async batch(statements) {
    try {
      const preparedStatements = statements.map(stmt =>
        this.db.prepare(stmt.sql).bind(...(stmt.params || []))
      );
      const results = await this.db.batch(preparedStatements);
      return {
        success: true,
        results: results
      };
    } catch (error) {
      console.error('Database batch error:', error);
      return {
        success: false,
        error: error.message,
        results: []
      };
    }
  }

  /**
   * Insert a new record
   * @param {string} table - Table name
   * @param {Object} data - Data to insert
   * @returns {Promise<Object>} Insert result
   */
  async insert(table, data) {
    try {
      const columns = Object.keys(data);
      const values = Object.values(data);
      const placeholders = columns.map(() => '?').join(', ');

      const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;

      const result = await this.db.prepare(sql).bind(...values).run();

      return {
        success: result.success,
        meta: result.meta
      };
    } catch (error) {
      console.error('Database insert error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update records
   * @param {string} table - Table name
   * @param {Object} data - Data to update
   * @param {Object} where - Where conditions {column: value}
   * @returns {Promise<Object>} Update result
   */
  async update(table, data, where) {
    try {
      const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
      const whereClause = Object.keys(where).map(key => `${key} = ?`).join(' AND ');

      const values = [...Object.values(data), ...Object.values(where)];

      const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;

      const result = await this.db.prepare(sql).bind(...values).run();

      return {
        success: result.success,
        meta: result.meta
      };
    } catch (error) {
      console.error('Database update error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Delete records
   * @param {string} table - Table name
   * @param {Object} where - Where conditions {column: value}
   * @returns {Promise<Object>} Delete result
   */
  async delete(table, where) {
    try {
      const whereClause = Object.keys(where).map(key => `${key} = ?`).join(' AND ');
      const values = Object.values(where);

      const sql = `DELETE FROM ${table} WHERE ${whereClause}`;

      const result = await this.db.prepare(sql).bind(...values).run();

      return {
        success: result.success,
        meta: result.meta
      };
    } catch (error) {
      console.error('Database delete error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Soft delete (set deleted_at)
   * @param {string} table - Table name
   * @param {Object} where - Where conditions
   * @returns {Promise<Object>} Update result
   */
  async softDelete(table, where) {
    return this.update(table, {
      deleted_at: new Date().toISOString(),
      is_active: 0
    }, where);
  }

  /**
   * Get database statistics
   * @returns {Promise<Object>} Database stats
   */
  async getStats() {
    try {
      const stats = {};

      // Get table counts
      const tables = ['cultural_datasets', 'reflexion_history', 'api_logs', 'user_sessions', 'api_keys'];

      for (const table of tables) {
        const result = await this.querySingle(`SELECT COUNT(*) as count FROM ${table}`);
        stats[table] = result.result?.count || 0;
      }

      // Get schema version
      const versionResult = await this.querySingle('SELECT * FROM schema_version ORDER BY applied_at DESC LIMIT 1');
      stats.schema_version = versionResult.result?.version || 'unknown';

      return {
        success: true,
        stats: stats
      };
    } catch (error) {
      console.error('Database stats error:', error);
      return {
        success: false,
        error: error.message,
        stats: {}
      };
    }
  }

  /**
   * Test database connection
   * @returns {Promise<boolean>} Connection status
   */
  async testConnection() {
    try {
      const result = await this.querySingle('SELECT 1 as test');
      return result.success && result.result?.test === 1;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }

  /**
   * Execute raw SQL (use with caution)
   * @param {string} sql - SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise<Object>} Query result
   */
  async raw(sql, params = []) {
    return this.query(sql, params);
  }
}

/**
 * Create a database service instance
 * @param {D1Database} db - Cloudflare D1 database binding
 * @returns {DatabaseService} Database service instance
 */
export function createDatabaseService(db) {
  return new DatabaseService(db);
}

/**
 * Helper function to generate UUID
 * @returns {string} UUID v4
 */
export function generateId() {
  return crypto.randomUUID();
}

/**
 * Helper function to get current ISO timestamp
 * @returns {string} ISO timestamp
 */
export function getCurrentTimestamp() {
  return new Date().toISOString();
}

export default DatabaseService;
