// Recommendations Routes
// Provides intelligent content recommendation endpoints

/**
 * Recommendations Routes
 * @param {Object} recommendationsService - Recommendations service instance
 * @returns {Object} Route handlers
 */
export function createRecommendationsRoutes(recommendationsService) {
  return {
    /**
     * GET /api/v1/datasets/:id/recommendations
     * Get recommendations for a specific dataset
     */
    datasetRecommendations: async (datasetId, searchParams) => {
      const limit = parseInt(searchParams.get('limit') || '5', 10);

      const data = await recommendationsService.getRecommendations(datasetId, limit);

      return data;
    },

    /**
     * GET /api/v1/recommendations/personalized
     * Get personalized recommendations based on session history
     */
    personalized: async (request, searchParams) => {
      const limit = parseInt(searchParams.get('limit') || '10', 10);
      const sessionId = searchParams.get('session') || request.headers.get('X-Session-ID') || 'anonymous';

      const data = await recommendationsService.getPersonalizedRecommendations(sessionId, limit);

      return data;
    },

    /**
     * GET /api/v1/datasets/:id/similar
     * Get similar datasets (content-based only)
     */
    similar: async (datasetId, searchParams) => {
      const limit = parseInt(searchParams.get('limit') || '5', 10);

      // Get the source dataset
      const sourceSql = `SELECT * FROM cultural_datasets WHERE id = ? AND is_active = 1`;
      const source = await recommendationsService.db.querySingle(sourceSql, [datasetId]);

      if (!source.result) {
        return {
          success: false,
          error: { message: 'Dataset not found' }
        };
      }

      const similar = await recommendationsService.getSimilarByCategory(source.result, limit);

      return {
        success: true,
        source: {
          id: source.result.id,
          input: source.result.input,
          category: source.result.category
        },
        similar: similar.data,
        total: similar.data.length
      };
    },

    /**
     * GET /api/v1/datasets/:id/also-viewed
     * Get "users also viewed" recommendations (collaborative filtering)
     */
    alsoViewed: async (datasetId, searchParams) => {
      const limit = parseInt(searchParams.get('limit') || '5', 10);

      const data = await recommendationsService.getUsersAlsoViewed(datasetId, limit);

      return {
        success: true,
        dataset_id: datasetId,
        also_viewed: data.data,
        total: data.data.length
      };
    }
  };
}

export default createRecommendationsRoutes;
