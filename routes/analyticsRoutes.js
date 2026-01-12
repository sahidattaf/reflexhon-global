// Analytics Routes
// Provides analytics dashboard endpoints

/**
 * Analytics Routes
 * @param {Object} analyticsService - Analytics service instance
 * @returns {Object} Route handlers
 */
export function createAnalyticsRoutes(analyticsService) {
  return {
    /**
     * GET /api/v1/analytics/dashboard
     * Get analytics dashboard overview
     */
    dashboard: async (request, searchParams) => {
      const timeRange = searchParams.get('range') || '24h';

      const data = await analyticsService.getDashboard(timeRange);

      return {
        success: true,
        data,
        timeRange
      };
    },

    /**
     * GET /api/v1/analytics/trending
     * Get trending datasets
     */
    trending: async (request, searchParams) => {
      const limit = parseInt(searchParams.get('limit') || '10', 10);

      const data = await analyticsService.getTrending(limit);

      return data;
    },

    /**
     * GET /api/v1/analytics/searches
     * Get popular search terms
     */
    searches: async (request, searchParams) => {
      const limit = parseInt(searchParams.get('limit') || '20', 10);

      const data = await analyticsService.getPopularSearches(limit);

      return data;
    },

    /**
     * GET /api/v1/analytics/traffic
     * Get traffic overview
     */
    traffic: async (request, searchParams) => {
      const timeRange = searchParams.get('range') || '24h';

      const data = await analyticsService.getTrafficOverview(timeRange);

      return data;
    },

    /**
     * GET /api/v1/analytics/performance
     * Get performance metrics
     */
    performance: async (request, searchParams) => {
      const timeRange = searchParams.get('range') || '24h';

      const data = await analyticsService.getPerformanceMetrics(timeRange);

      return data;
    },

    /**
     * GET /api/v1/analytics/geographic
     * Get geographic distribution
     */
    geographic: async (request, searchParams) => {
      const timeRange = searchParams.get('range') || '24h';

      const data = await analyticsService.getGeographicDistribution(timeRange);

      return data;
    }
  };
}

export default createAnalyticsRoutes;
