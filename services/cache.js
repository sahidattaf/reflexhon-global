// Cache Service
// Implements Cloudflare Cache API for edge caching

/**
 * Cache Configuration
 * TTL in seconds
 */
const CACHE_CONFIG = {
  // Dataset endpoints
  'dataset_by_id': {
    ttl: 3600,        // 1 hour
    cacheable: true,
    staleWhileRevalidate: 7200  // 2 hours
  },
  'datasets_list': {
    ttl: 300,         // 5 minutes
    cacheable: true,
    staleWhileRevalidate: 600
  },
  'datasets_search': {
    ttl: 300,         // 5 minutes
    cacheable: true,
    staleWhileRevalidate: 600
  },
  'datasets_categories': {
    ttl: 1800,        // 30 minutes
    cacheable: true,
    staleWhileRevalidate: 3600
  },
  'popular_datasets': {
    ttl: 900,         // 15 minutes
    cacheable: true,
    staleWhileRevalidate: 1800
  },
  'admin_stats': {
    ttl: 120,         // 2 minutes
    cacheable: true,
    staleWhileRevalidate: 300
  },
  'rate_limit_stats': {
    ttl: 60,          // 1 minute
    cacheable: true,
    staleWhileRevalidate: 120
  },
  // Don't cache these
  'feedback': {
    ttl: 0,
    cacheable: false
  },
  'reflexion': {
    ttl: 0,
    cacheable: false
  }
};

/**
 * Cache Service
 */
export class CacheService {
  constructor(cacheApi) {
    this.cache = cacheApi;
  }

  /**
   * Get cache configuration for a cache key type
   * @param {string} cacheKeyType - Type of cache key
   * @returns {Object} Cache config
   */
  getConfig(cacheKeyType) {
    return CACHE_CONFIG[cacheKeyType] || { ttl: 0, cacheable: false };
  }

  /**
   * Generate cache key from request
   * @param {Request} request - Request object
   * @param {string} cacheKeyType - Type of cache key
   * @returns {Request} Cache key request
   */
  generateCacheKey(request, cacheKeyType) {
    const url = new URL(request.url);

    // Add cache key type to URL to avoid collisions
    url.searchParams.set('__cache_type', cacheKeyType);

    // Create a new request with the modified URL
    return new Request(url.toString(), request);
  }

  /**
   * Get cached response
   * @param {Request} request - Original request
   * @param {string} cacheKeyType - Type of cache key
   * @returns {Promise<Response|null>} Cached response or null
   */
  async get(request, cacheKeyType) {
    const config = this.getConfig(cacheKeyType);

    if (!config.cacheable || !this.cache) {
      return null;
    }

    try {
      const cacheKey = this.generateCacheKey(request, cacheKeyType);
      const cachedResponse = await this.cache.match(cacheKey);

      if (cachedResponse) {
        // Add cache hit header
        const headers = new Headers(cachedResponse.headers);
        headers.set('X-Cache', 'HIT');
        headers.set('X-Cache-Type', cacheKeyType);

        return new Response(cachedResponse.body, {
          status: cachedResponse.status,
          statusText: cachedResponse.statusText,
          headers: headers
        });
      }

      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Put response in cache
   * @param {Request} request - Original request
   * @param {Response} response - Response to cache
   * @param {string} cacheKeyType - Type of cache key
   * @returns {Promise<void>}
   */
  async put(request, response, cacheKeyType) {
    const config = this.getConfig(cacheKeyType);

    if (!config.cacheable || !this.cache || !response.ok) {
      return;
    }

    try {
      const cacheKey = this.generateCacheKey(request, cacheKeyType);

      // Clone response and add cache headers
      const headers = new Headers(response.headers);
      headers.set('Cache-Control', `public, max-age=${config.ttl}, stale-while-revalidate=${config.staleWhileRevalidate}`);
      headers.set('X-Cache', 'MISS');
      headers.set('X-Cache-Type', cacheKeyType);
      headers.set('X-Cache-TTL', config.ttl.toString());

      const cachedResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: headers
      });

      // Store in cache (don't await - fire and forget)
      this.cache.put(cacheKey, cachedResponse);
    } catch (error) {
      console.error('Cache put error:', error);
    }
  }

  /**
   * Invalidate cache for a specific key type
   * @param {Request} request - Original request
   * @param {string} cacheKeyType - Type of cache key
   * @returns {Promise<boolean>} Success
   */
  async invalidate(request, cacheKeyType) {
    if (!this.cache) {
      return false;
    }

    try {
      const cacheKey = this.generateCacheKey(request, cacheKeyType);
      const deleted = await this.cache.delete(cacheKey);
      return deleted;
    } catch (error) {
      console.error('Cache invalidate error:', error);
      return false;
    }
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache config info
   */
  getStats() {
    return {
      success: true,
      cache_enabled: !!this.cache,
      cache_types: Object.keys(CACHE_CONFIG).map(type => ({
        type,
        ttl: CACHE_CONFIG[type].ttl,
        cacheable: CACHE_CONFIG[type].cacheable
      }))
    };
  }
}

/**
 * Create cache service instance
 * @param {Cache} cacheApi - Cloudflare Cache API
 * @returns {CacheService} Cache service
 */
export function createCacheService(cacheApi) {
  return new CacheService(cacheApi);
}

export default CacheService;
