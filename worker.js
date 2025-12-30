// Cloudflare Workers entry point
// Simple fetch handler without Express dependencies

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Health check endpoint
      if (path === '/health' || path === '/health/') {
        return new Response(
          JSON.stringify({
            status: 'ok',
            timestamp: new Date().toISOString(),
            message: 'Reflexhon Global API is running on Cloudflare Workers',
            environment: env.NODE_ENV || 'production'
          }),
          { headers: corsHeaders, status: 200 }
        );
      }

      // API info endpoint
      if (path === '/api' || path === '/api/') {
        return new Response(
          JSON.stringify({
            success: true,
            name: 'Reflexhon Global API',
            version: '1.0.0',
            description: 'Cultural Alignment API for Papiamentu',
            endpoints: {
              health: '/health',
              datasets: '/api/v1/datasets',
              reflexion: '/api/v1/reflexion'
            }
          }),
          { headers: corsHeaders, status: 200 }
        );
      }

      // Datasets endpoint
      if (path === '/api/v1/datasets' || path === '/api/v1/datasets/') {
        return new Response(
          JSON.stringify({
            success: true,
            data: {
              total: 0,
              datasets: [],
              message: 'Dataset integration coming soon'
            }
          }),
          { headers: corsHeaders, status: 200 }
        );
      }

      // Reflexion endpoint
      if (path === '/api/v1/reflexion' || path === '/api/v1/reflexion/') {
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Reflexion API endpoint',
            methods: ['POST /api/v1/reflexion/process', 'POST /api/v1/reflexion/analyze']
          }),
          { headers: corsHeaders, status: 200 }
        );
      }

      // Root endpoint
      if (path === '/' || path === '') {
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Welcome to Reflexhon Global API',
            version: '1.0.0',
            documentation: '/api',
            health: '/health'
          }),
          { headers: corsHeaders, status: 200 }
        );
      }

      // 404 for other routes
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            message: 'Not Found',
            path: path
          }
        }),
        { headers: corsHeaders, status: 404 }
      );

    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            message: error.message || 'Internal Server Error'
          }
        }),
        { headers: corsHeaders, status: 500 }
      );
    }
  }
};
