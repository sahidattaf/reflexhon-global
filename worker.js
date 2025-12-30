// Cloudflare Workers entry point
import app from './server.js';

// Convert Express app to Workers fetch handler
export default {
  async fetch(request, env, ctx) {
    try {
      // Create a new Request object for Express
      const url = new URL(request.url);

      // Simple routing for now - health check
      if (url.pathname === '/health') {
        return new Response(
          JSON.stringify({
            status: 'ok',
            timestamp: new Date().toISOString(),
            message: 'Reflexhon Global API is running on Cloudflare Workers'
          }),
          {
            headers: { 'content-type': 'application/json' },
            status: 200
          }
        );
      }

      // For API routes, return a basic response
      if (url.pathname.startsWith('/api')) {
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Reflexhon Global API',
            version: '1.0.0',
            endpoints: [
              '/health - Health check',
              '/api/v1/datasets - List datasets',
              '/api/v1/reflexion/process - Process reflexion'
            ]
          }),
          {
            headers: { 'content-type': 'application/json' },
            status: 200
          }
        );
      }

      // Default response
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Welcome to Reflexhon Global API',
          docs: '/api'
        }),
        {
          headers: { 'content-type': 'application/json' },
          status: 200
        }
      );

    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message
        }),
        {
          headers: { 'content-type': 'application/json' },
          status: 500
        }
      );
    }
  }
};
