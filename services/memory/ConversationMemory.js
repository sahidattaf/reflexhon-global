import { logger } from '../../utils/logger.js';

/**
 * Conversation Memory Service
 *
 * Stores and retrieves conversation history using D1 database.
 * Enables context-aware responses by maintaining conversation continuity.
 *
 * Features:
 * - Store user messages and AI responses
 * - Retrieve conversation history
 * - Summarize long conversations
 * - Find relevant context from past messages
 * - Track emotional progression
 * - Session management
 *
 * Database Schema (D1):
 * CREATE TABLE conversations (
 *   id TEXT PRIMARY KEY,
 *   session_id TEXT NOT NULL,
 *   role TEXT NOT NULL,        -- 'user' or 'assistant'
 *   content TEXT NOT NULL,
 *   emotion TEXT,               -- Detected emotion
 *   cultural_context TEXT,      -- Cultural markers (JSON)
 *   timestamp INTEGER NOT NULL,
 *   metadata TEXT               -- Additional data (JSON)
 * );
 */
class ConversationMemory {
  constructor(dbService = null) {
    this.db = dbService;
    this.defaultLimit = 10;
    this.maxHistorySize = 100;
  }

  /**
   * Initialize with database service
   *
   * @param {Object} dbService - Database service instance
   */
  initialize(dbService) {
    this.db = dbService;
    logger.info('ConversationMemory initialized with database');
  }

  /**
   * Store a message in conversation history
   *
   * @param {string} sessionId - Session ID
   * @param {Object} message - Message object
   * @returns {Promise<Object>} Result
   */
  async storeMessage(sessionId, message) {
    const startTime = Date.now();

    logger.info('Storing conversation message', {
      session_id: sessionId,
      role: message.role
    });

    try {
      if (!this.db) {
        logger.warn('Database not available, using in-memory storage');
        return this._storeInMemory(sessionId, message);
      }

      const messageId = this._generateId();
      const timestamp = Date.now();

      // Prepare data
      const data = {
        id: messageId,
        session_id: sessionId,
        role: message.role, // 'user' or 'assistant'
        content: message.content,
        emotion: message.emotion || null,
        cultural_context: message.cultural_context ? JSON.stringify(message.cultural_context) : null,
        timestamp: timestamp,
        metadata: message.metadata ? JSON.stringify(message.metadata) : null
      };

      // Insert into database
      await this.db.insert('conversations', data);

      logger.info('Message stored successfully', {
        message_id: messageId,
        duration_ms: Date.now() - startTime
      });

      return {
        success: true,
        message_id: messageId,
        session_id: sessionId,
        timestamp
      };
    } catch (error) {
      logger.error('Failed to store message', {
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
   * Get conversation history for a session
   *
   * @param {string} sessionId - Session ID
   * @param {number} limit - Maximum messages to retrieve
   * @returns {Promise<Object>} Conversation history
   */
  async getHistory(sessionId, limit = null) {
    const startTime = Date.now();
    const maxMessages = limit || this.defaultLimit;

    logger.info('Retrieving conversation history', {
      session_id: sessionId,
      limit: maxMessages
    });

    try {
      if (!this.db) {
        logger.warn('Database not available');
        return this._getInMemoryHistory(sessionId, maxMessages);
      }

      // Query database for recent messages
      const sql = `
        SELECT * FROM conversations
        WHERE session_id = ?
        ORDER BY timestamp DESC
        LIMIT ?
      `;

      const result = await this.db.query(sql, [sessionId, maxMessages]);

      // Reverse to get chronological order
      const messages = result.results.reverse().map(row => ({
        id: row.id,
        role: row.role,
        content: row.content,
        emotion: row.emotion,
        cultural_context: row.cultural_context ? JSON.parse(row.cultural_context) : null,
        timestamp: row.timestamp,
        metadata: row.metadata ? JSON.parse(row.metadata) : null
      }));

      logger.info('History retrieved', {
        session_id: sessionId,
        message_count: messages.length,
        duration_ms: Date.now() - startTime
      });

      return {
        success: true,
        session_id: sessionId,
        messages,
        count: messages.length,
        has_more: result.results.length === maxMessages
      };
    } catch (error) {
      logger.error('Failed to retrieve history', {
        error: error.message,
        session_id: sessionId
      });

      return {
        success: false,
        error: error.message,
        messages: []
      };
    }
  }

  /**
   * Summarize conversation for long sessions
   *
   * @param {string} sessionId - Session ID
   * @returns {Promise<Object>} Summary
   */
  async summarizeConversation(sessionId) {
    const startTime = Date.now();

    logger.info('Summarizing conversation', { session_id: sessionId });

    try {
      const history = await this.getHistory(sessionId, this.maxHistorySize);

      if (!history.success || history.messages.length === 0) {
        return {
          success: false,
          summary: 'No conversation history available'
        };
      }

      const messages = history.messages;

      // Extract key information
      const summary = {
        total_messages: messages.length,
        user_messages: messages.filter(m => m.role === 'user').length,
        assistant_messages: messages.filter(m => m.role === 'assistant').length,

        // Emotion progression
        emotions_detected: messages
          .filter(m => m.emotion)
          .map(m => m.emotion),

        // Cultural markers used
        cultural_markers: this._extractCulturalMarkers(messages),

        // Topics discussed (simple keyword extraction)
        topics: this._extractTopics(messages),

        // First and last message
        conversation_start: messages[0]?.timestamp,
        conversation_end: messages[messages.length - 1]?.timestamp,
        duration_minutes: messages.length > 0
          ? Math.round((messages[messages.length - 1].timestamp - messages[0].timestamp) / 60000)
          : 0,

        // Key points (first user message and last exchange)
        key_points: {
          initial_query: messages.find(m => m.role === 'user')?.content.substring(0, 100),
          recent_context: messages.slice(-4).map(m => ({
            role: m.role,
            content: m.content.substring(0, 50) + '...'
          }))
        }
      };

      logger.info('Conversation summarized', {
        session_id: sessionId,
        total_messages: summary.total_messages,
        duration_ms: Date.now() - startTime
      });

      return {
        success: true,
        session_id: sessionId,
        summary
      };
    } catch (error) {
      logger.error('Failed to summarize conversation', {
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
   * Get relevant context from past messages
   *
   * @param {string} sessionId - Session ID
   * @param {string} currentInput - Current user input
   * @returns {Promise<Object>} Relevant context
   */
  async getRelevantContext(sessionId, currentInput) {
    const startTime = Date.now();

    logger.info('Finding relevant context', {
      session_id: sessionId,
      input_length: currentInput.length
    });

    try {
      const history = await this.getHistory(sessionId, 20);

      if (!history.success || history.messages.length === 0) {
        return {
          success: true,
          relevant_messages: [],
          context: 'No previous context available'
        };
      }

      // Simple keyword matching for relevance
      const keywords = this._extractKeywords(currentInput);
      const relevantMessages = [];

      for (const message of history.messages) {
        const messageKeywords = this._extractKeywords(message.content);
        const overlap = keywords.filter(k => messageKeywords.includes(k));

        if (overlap.length > 0) {
          relevantMessages.push({
            ...message,
            relevance_score: overlap.length / keywords.length,
            matching_keywords: overlap
          });
        }
      }

      // Sort by relevance
      relevantMessages.sort((a, b) => b.relevance_score - a.relevance_score);

      // Take top 3 most relevant
      const topRelevant = relevantMessages.slice(0, 3);

      logger.info('Relevant context found', {
        session_id: sessionId,
        relevant_count: topRelevant.length,
        duration_ms: Date.now() - startTime
      });

      return {
        success: true,
        relevant_messages: topRelevant,
        context: topRelevant.length > 0
          ? `Previous discussion touched on: ${topRelevant.map(m => m.content.substring(0, 50)).join('; ')}`
          : 'No directly relevant previous context'
      };
    } catch (error) {
      logger.error('Failed to find relevant context', {
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
   * Delete conversation history
   *
   * @param {string} sessionId - Session ID
   * @returns {Promise<Object>} Result
   */
  async deleteHistory(sessionId) {
    logger.info('Deleting conversation history', { session_id: sessionId });

    try {
      if (!this.db) {
        return { success: false, error: 'Database not available' };
      }

      const sql = 'DELETE FROM conversations WHERE session_id = ?';
      await this.db.query(sql, [sessionId]);

      logger.info('History deleted', { session_id: sessionId });

      return {
        success: true,
        session_id: sessionId
      };
    } catch (error) {
      logger.error('Failed to delete history', {
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
   * Get conversation statistics
   *
   * @returns {Object} Statistics
   */
  getStats() {
    return {
      default_limit: this.defaultLimit,
      max_history_size: this.maxHistorySize,
      database_enabled: this.db !== null
    };
  }

  // ===== PRIVATE METHODS =====

  /**
   * Generate unique ID
   */
  _generateId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Store in memory (fallback when DB not available)
   */
  _storeInMemory(sessionId, message) {
    // Simple in-memory storage (not persistent)
    if (!this._memoryStore) {
      this._memoryStore = new Map();
    }

    if (!this._memoryStore.has(sessionId)) {
      this._memoryStore.set(sessionId, []);
    }

    const messageId = this._generateId();
    const stored = {
      id: messageId,
      ...message,
      timestamp: Date.now()
    };

    this._memoryStore.get(sessionId).push(stored);

    return {
      success: true,
      message_id: messageId,
      session_id: sessionId,
      warning: 'Stored in memory only (not persistent)'
    };
  }

  /**
   * Get from memory (fallback)
   */
  _getInMemoryHistory(sessionId, limit) {
    if (!this._memoryStore || !this._memoryStore.has(sessionId)) {
      return {
        success: true,
        messages: [],
        count: 0,
        warning: 'No in-memory history available'
      };
    }

    const messages = this._memoryStore.get(sessionId).slice(-limit);

    return {
      success: true,
      session_id: sessionId,
      messages,
      count: messages.length
    };
  }

  /**
   * Extract cultural markers from messages
   */
  _extractCulturalMarkers(messages) {
    const markers = new Set();

    for (const message of messages) {
      if (message.cultural_context) {
        const context = message.cultural_context;
        if (context.markers) {
          context.markers.forEach(m => markers.add(m));
        }
      }
    }

    return Array.from(markers);
  }

  /**
   * Extract topics from messages
   */
  _extractTopics(messages) {
    const culturalTopics = [
      'empatia', 'respeto', 'stima', 'famia', 'komunidad',
      'kultura', 'alegria', 'tristesa', 'amor'
    ];

    const topics = new Set();

    for (const message of messages) {
      const lowerContent = message.content.toLowerCase();
      culturalTopics.forEach(topic => {
        if (lowerContent.includes(topic)) {
          topics.add(topic);
        }
      });
    }

    return Array.from(topics);
  }

  /**
   * Extract keywords for relevance matching
   */
  _extractKeywords(text) {
    // Simple keyword extraction (split and filter)
    const stopWords = ['ta', 'e', 'di', 'na', 'pa', 'ku', 'i', 'un', 'mi', 'bo'];
    const words = text.toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.includes(w));

    return [...new Set(words)];
  }
}

export default ConversationMemory;
