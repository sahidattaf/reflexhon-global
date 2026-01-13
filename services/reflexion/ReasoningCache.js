import { logger } from '../../utils/logger.js';

/**
 * Reasoning Cache Service
 *
 * Caches common reasoning patterns and responses to improve performance.
 * Uses in-memory cache with TTL, will integrate with Cloudflare KV later.
 */
class ReasoningCache {
  constructor() {
    // In-memory cache (will be replaced with Cloudflare KV)
    this.cache = new Map();
    this.ttl = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    this.maxSize = 1000; // Maximum cache entries

    // Cache statistics
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      evictions: 0
    };

    // Start cleanup interval
    this._startCleanupInterval();
  }

  /**
   * Get cached response
   *
   * @param {string} key - Cache key
   * @returns {Object|null} Cached response or null
   */
  async get(key) {
    try {
      const entry = this.cache.get(key);

      if (!entry) {
        this.stats.misses++;
        logger.debug('Cache miss', { key });
        return null;
      }

      // Check if expired
      if (Date.now() > entry.expiresAt) {
        this.cache.delete(key);
        this.stats.misses++;
        logger.debug('Cache expired', { key });
        return null;
      }

      this.stats.hits++;
      logger.debug('Cache hit', { key, age_ms: Date.now() - entry.timestamp });
      return entry.value;
    } catch (error) {
      logger.error('Cache get error', { key, error });
      return null;
    }
  }

  /**
   * Set cache entry
   *
   * @param {string} key - Cache key
   * @param {Object} value - Value to cache
   * @param {number} customTTL - Optional custom TTL in milliseconds
   * @returns {boolean} Success
   */
  async set(key, value, customTTL = null) {
    try {
      // Check cache size limit
      if (this.cache.size >= this.maxSize) {
        this._evictOldest();
      }

      const ttl = customTTL || this.ttl;
      const entry = {
        value,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttl,
        hits: 0
      };

      this.cache.set(key, entry);
      this.stats.sets++;

      logger.debug('Cache set', {
        key,
        ttl_hours: ttl / (60 * 60 * 1000),
        cache_size: this.cache.size
      });

      return true;
    } catch (error) {
      logger.error('Cache set error', { key, error });
      return false;
    }
  }

  /**
   * Delete cache entry
   *
   * @param {string} key - Cache key
   * @returns {boolean} Success
   */
  async delete(key) {
    try {
      const deleted = this.cache.delete(key);
      if (deleted) {
        logger.debug('Cache delete', { key });
      }
      return deleted;
    } catch (error) {
      logger.error('Cache delete error', { key, error });
      return false;
    }
  }

  /**
   * Clear all cache entries
   *
   * @returns {boolean} Success
   */
  async clear() {
    try {
      this.cache.clear();
      logger.info('Cache cleared');
      return true;
    } catch (error) {
      logger.error('Cache clear error', error);
      return false;
    }
  }

  /**
   * Get cache statistics
   *
   * @returns {Object} Cache stats
   */
  getStats() {
    const hitRate = this.stats.hits + this.stats.misses > 0
      ? (this.stats.hits / (this.stats.hits + this.stats.misses)) * 100
      : 0;

    return {
      ...this.stats,
      hit_rate: hitRate.toFixed(2) + '%',
      size: this.cache.size,
      max_size: this.maxSize
    };
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      evictions: 0
    };
    logger.info('Cache stats reset');
  }

  /**
   * Cache common patterns
   *
   * Pre-warms cache with frequently asked questions
   */
  async warmupCache() {
    logger.info('Warming up cache with common patterns...');

    const commonPatterns = [
      {
        key: 'reflexion:Kiko ta empatia?:{}:{}',
        response: this._createWarmupResponse(
          'Empatia ta e kapasidad pa kompronde kon otro persona ta sinti. Ta ponebo den zapatu di e otro hende.',
          'What is empathy?',
          95
        )
      },
      {
        key: 'reflexion:Kiko ta respeto?:{}:{}',
        response: this._createWarmupResponse(
          'Respeto ta e balor fundamental den nos kultura Karibense. Ta mustra konsiderashon i dignidad pa otro hendenan.',
          'What is respect?',
          96
        )
      },
      {
        key: 'reflexion:Bon dia:{}:{}',
        response: this._createWarmupResponse(
          'Bon dia! Kon bo ta? Mi ta Reflexhon Global, bo asistente kultural. Kon mi por yuda bo?',
          'Good morning',
          98
        )
      },
      {
        key: 'reflexion:Danki:{}:{}',
        response: this._createWarmupResponse(
          'Di nada! Ta un plasergrande pa yuda bo. Mi ta semper na bo disposishon.',
          'Thank you',
          97
        )
      }
    ];

    for (const pattern of commonPatterns) {
      await this.set(pattern.key, pattern.response, this.ttl);
    }

    logger.info(`Cache warmed up with ${commonPatterns.length} patterns`);
  }

  /**
   * Get popular cache entries
   *
   * @param {number} limit - Number of entries to return
   * @returns {Array} Top cache entries by hits
   */
  getPopularEntries(limit = 10) {
    const entries = Array.from(this.cache.entries())
      .map(([key, entry]) => ({
        key,
        hits: entry.hits,
        age_hours: (Date.now() - entry.timestamp) / (60 * 60 * 1000)
      }))
      .sort((a, b) => b.hits - a.hits)
      .slice(0, limit);

    return entries;
  }

  // ===== PRIVATE METHODS =====

  /**
   * Evict oldest cache entry
   */
  _evictOldest() {
    let oldestKey = null;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.stats.evictions++;
      logger.debug('Cache eviction', { key: oldestKey });
    }
  }

  /**
   * Start periodic cleanup of expired entries
   */
  _startCleanupInterval() {
    // Run cleanup every 5 minutes
    setInterval(() => {
      this._cleanupExpired();
    }, 5 * 60 * 1000);
  }

  /**
   * Clean up expired entries
   */
  _cleanupExpired() {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      logger.debug('Cache cleanup', { expired_entries: cleaned });
    }
  }

  /**
   * Create warmup response
   */
  _createWarmupResponse(response, translation, score) {
    return {
      response,
      confidence: score / 100,
      reasoning_chain: [
        {
          layer: 'analysis',
          insights: ['Pre-cached common pattern'],
          duration_ms: 0
        },
        {
          layer: 'reasoning',
          approach: 'cached_response',
          duration_ms: 0
        },
        {
          layer: 'reflection',
          quality_check: `Cached response, score: ${score}%`,
          improvements: [],
          duration_ms: 0
        },
        {
          layer: 'evaluation',
          scores: { overall: score },
          duration_ms: 0
        },
        {
          layer: 'generation',
          polish_applied: true,
          duration_ms: 0
        }
      ],
      scores: {
        cultural_alignment: score,
        clarity: score,
        empathy: score,
        respeto: score,
        overall: score
      },
      metadata: {
        model: 'cached',
        processing_time_ms: 0,
        total_processing_time_ms: 0,
        layers_processed: 0,
        reflection_depth: 0,
        cached: true
      }
    };
  }
}

export default new ReasoningCache();
