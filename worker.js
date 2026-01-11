// Cloudflare Workers entry point
// Reflexhon Global API - Cultural AI Alignment

import { getAllDatasets, getDatasetById, searchDatasets } from './datasets.js';
import { processReflexion, analyzeReasoning } from './reflexion.js';
import { createDatabaseService, generateId, getCurrentTimestamp } from './services/db.js';
import { createCulturalDataService } from './services/cultural-data.js';
import { createRateLimiterService } from './services/rate-limiter.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const requestStartTime = Date.now();
    const requestId = generateId();

    // Initialize database services if D1 is available
    let dbService = null;
    let culturalData = null;
    let rateLimiter = null;
    let dbEnabled = false;

    if (env.DB) {
      try {
        dbService = createDatabaseService(env.DB);
        culturalData = createCulturalDataService(dbService);
        rateLimiter = createRateLimiterService(dbService);
        dbEnabled = true;
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    }

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

    // Helper function to add rate limit headers
    const addRateLimitHeaders = (headers, rateLimit) => {
      if (rateLimit && rateLimit.success) {
        headers['X-RateLimit-Limit'] = rateLimit.limit?.toString() || '100';
        headers['X-RateLimit-Remaining'] = rateLimit.remaining?.toString() || '0';
        headers['X-RateLimit-Reset'] = rateLimit.reset?.toString() || '';
        if (rateLimit.retryAfter) {
          headers['Retry-After'] = rateLimit.retryAfter.toString();
        }
      }
      return headers;
    };

    try {
      // Rate limiting (skip for health check and API info)
      let rateLimitResult = null;
      if (rateLimiter && path !== '/health' && path !== '/health/' && path !== '/api' && path !== '/api/' && path !== '/' && path !== '') {
        const clientIp = request.headers.get('CF-Connecting-IP') || 'unknown';
        rateLimitResult = await rateLimiter.checkRateLimit(clientIp, path);

        if (!rateLimitResult.allowed) {
          const rateLimitHeaders = addRateLimitHeaders({ ...corsHeaders }, rateLimitResult);
          return new Response(
            JSON.stringify({
              success: false,
              error: {
                message: 'Too Many Requests',
                code: 'RATE_LIMIT_EXCEEDED',
                limit: rateLimitResult.limit,
                retryAfter: rateLimitResult.retryAfter
              }
            }),
            { headers: rateLimitHeaders, status: 429 }
          );
        }
      }

      // Health check endpoint
      if (path === '/health' || path === '/health/') {
        // Test database connection if available
        let dbHealth = 'disabled';
        if (dbEnabled && dbService) {
          const dbConnected = await dbService.testConnection();
          dbHealth = dbConnected ? 'healthy' : 'error';
        }

        return new Response(
          JSON.stringify({
            status: 'ok',
            timestamp: new Date().toISOString(),
            message: 'Reflexhon Global API is running on Cloudflare Workers',
            environment: env.NODE_ENV || 'production',
            version: '1.5.0',
            features: {
              datasets: 'enabled',
              reflexion: 'enabled',
              cloudflare_ai: env.AI ? 'enabled' : 'disabled',
              huggingface_datasets: env.HF_TOKEN ? 'enabled' : 'disabled',
              huggingface_ai: (env.HF_TOKEN && env.HF_MODEL) ? 'enabled' : 'disabled',
              database: dbHealth,
              rate_limiting: rateLimiter ? 'enabled' : 'disabled'
            }
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
            version: '1.2.0',
            description: 'Cultural Alignment API for Papiamentu - Powered by HuggingFace',
            endpoints: {
              health: {
                path: '/health',
                method: 'GET',
                description: 'API health check'
              },
              datasets: {
                list: {
                  path: '/api/v1/datasets',
                  method: 'GET',
                  description: 'List all cultural alignment datasets',
                  params: 'limit, offset, category, language'
                },
                categories: {
                  path: '/api/v1/datasets/categories',
                  method: 'GET',
                  description: 'Get all available categories with counts'
                },
                get: {
                  path: '/api/v1/datasets/:id',
                  method: 'GET',
                  description: 'Get specific dataset by ID (auto-tracks usage)'
                },
                search: {
                  path: '/api/v1/datasets/search?q=query',
                  method: 'GET',
                  description: 'Search datasets using FTS5 full-text search',
                  params: 'q (required), category, limit'
                },
                feedback: {
                  path: '/api/v1/datasets/:id/feedback',
                  method: 'POST',
                  description: 'Submit feedback for a dataset',
                  body: {
                    positive: 'boolean (required) - true for positive, false for negative',
                    comment: 'string (optional) - user comment'
                  }
                }
              },
              reflexion: {
                process: {
                  path: '/api/v1/reflexion/process',
                  method: 'POST',
                  description: 'Process input through reflexion loop',
                  body: {
                    input: 'string (required)',
                    context: 'object (optional)'
                  }
                },
                analyze: {
                  path: '/api/v1/reflexion/analyze',
                  method: 'POST',
                  description: 'Analyze reasoning patterns',
                  body: {
                    text: 'string (required)'
                  }
                }
              }
            },
            documentation: 'https://github.com/sahidattaf/reflexhon-global'
          }),
          { headers: corsHeaders, status: 200 }
        );
      }

      // ===== DATASET ENDPOINTS =====

      // Get available categories
      if (path === '/api/v1/datasets/categories' || path === '/api/v1/datasets/categories/') {
        if (!dbEnabled || !culturalData) {
          return new Response(
            JSON.stringify({
              success: false,
              error: { message: 'Database is not enabled' }
            }),
            { headers: corsHeaders, status: 503 }
          );
        }

        try {
          const sql = `
            SELECT category, COUNT(*) as count
            FROM cultural_datasets
            WHERE is_active = 1 AND deleted_at IS NULL
            GROUP BY category
            ORDER BY category
          `;
          const result = await dbService.query(sql);

          return new Response(
            JSON.stringify({
              success: true,
              data: result.results,
              total: result.results.length
            }),
            { headers: corsHeaders, status: 200 }
          );
        } catch (error) {
          return new Response(
            JSON.stringify({
              success: false,
              error: { message: error.message }
            }),
            { headers: corsHeaders, status: 500 }
          );
        }
      }

      // List all datasets (D1 if available, otherwise fallback)
      if (path === '/api/v1/datasets' || path === '/api/v1/datasets/') {
        let result;

        if (dbEnabled && culturalData) {
          // Use D1 database
          const limit = parseInt(url.searchParams.get('limit')) || 100;
          const offset = parseInt(url.searchParams.get('offset')) || 0;
          const category = url.searchParams.get('category') || null;
          const language = url.searchParams.get('language') || null;

          result = await culturalData.getAll({
            limit,
            offset,
            category,
            language,
            status: 'approved'
          });

          // Add metadata
          result.source = 'd1_database';
          result.message = 'Data from Cloudflare D1 database';
        } else {
          // Fallback to HuggingFace or local datasets
          result = await getAllDatasets(env);
          result.source = 'fallback';
        }

        return new Response(
          JSON.stringify(result),
          { headers: corsHeaders, status: 200 }
        );
      }

      // Search datasets
      if (path.startsWith('/api/v1/datasets/search')) {
        const query = url.searchParams.get('q');
        if (!query) {
          return new Response(
            JSON.stringify({
              success: false,
              error: { message: 'Query parameter "q" is required' }
            }),
            { headers: corsHeaders, status: 400 }
          );
        }

        let result;

        if (dbEnabled && culturalData) {
          // Use D1 full-text search
          const category = url.searchParams.get('category') || null;
          const limit = parseInt(url.searchParams.get('limit')) || 50;

          result = await culturalData.search(query, { category, limit });
          result.source = 'd1_database';
        } else {
          // Fallback to local search
          result = searchDatasets(query);
          result.source = 'fallback';
        }

        return new Response(
          JSON.stringify(result),
          { headers: corsHeaders, status: 200 }
        );
      }

      // Feedback endpoint for datasets
      const feedbackMatch = path.match(/^\/api\/v1\/datasets\/([^\/]+)\/feedback\/?$/);
      if (feedbackMatch) {
        if (request.method !== 'POST') {
          return new Response(
            JSON.stringify({
              success: false,
              error: { message: 'Method not allowed. Use POST.' }
            }),
            { headers: corsHeaders, status: 405 }
          );
        }

        if (!dbEnabled || !culturalData) {
          return new Response(
            JSON.stringify({
              success: false,
              error: { message: 'Database is not enabled. Feedback requires D1 database.' }
            }),
            { headers: corsHeaders, status: 503 }
          );
        }

        const id = feedbackMatch[1];
        const body = await request.json().catch(() => null);

        if (!body || typeof body.positive !== 'boolean') {
          return new Response(
            JSON.stringify({
              success: false,
              error: { message: 'Request body must include "positive" field (boolean)' }
            }),
            { headers: corsHeaders, status: 400 }
          );
        }

        const result = await culturalData.addFeedback(id, body.positive);

        // Also log feedback to cultural_feedback table if needed
        if (result.success && dbService) {
          try {
            await dbService.insert('cultural_feedback', {
              id: generateId(),
              dataset_id: id,
              feedback_type: body.positive ? 'positive' : 'negative',
              user_comment: body.comment || null,
              session_id: requestId,
              ip_address: request.headers.get('CF-Connecting-IP') || null,
              created_at: getCurrentTimestamp()
            });
          } catch (error) {
            console.error('Failed to log feedback to cultural_feedback table:', error);
          }
        }

        const status = result.success ? 200 : 500;

        return new Response(
          JSON.stringify({
            success: result.success,
            message: result.success
              ? `${body.positive ? 'Positive' : 'Negative'} feedback recorded`
              : 'Failed to record feedback',
            error: result.error || null
          }),
          { headers: corsHeaders, status }
        );
      }

      // Get dataset by ID
      const datasetIdMatch = path.match(/^\/api\/v1\/datasets\/([^\/]+)\/?$/);
      if (datasetIdMatch) {
        const id = datasetIdMatch[1];
        let result;

        if (dbEnabled && culturalData) {
          // Use D1 database
          result = await culturalData.getById(id);
          result.source = 'd1_database';
        } else {
          // Fallback to local datasets
          result = getDatasetById(id);
          result.source = 'fallback';
        }

        const status = result.success ? 200 : 404;

        return new Response(
          JSON.stringify(result),
          { headers: corsHeaders, status }
        );
      }

      // ===== REFLEXION ENDPOINTS =====

      // Process reflexion
      if (path === '/api/v1/reflexion/process' || path === '/api/v1/reflexion/process/') {
        if (request.method !== 'POST') {
          return new Response(
            JSON.stringify({
              success: false,
              error: { message: 'Method not allowed. Use POST.' }
            }),
            { headers: corsHeaders, status: 405 }
          );
        }

        const body = await request.json().catch(() => null);
        if (!body || !body.input) {
          return new Response(
            JSON.stringify({
              success: false,
              error: { message: 'Request body must include "input" field' }
            }),
            { headers: corsHeaders, status: 400 }
          );
        }

        // Process with HuggingFace AI if available
        const result = await processReflexion(body.input, body.context || {}, env);

        // Log to database if available
        if (dbEnabled && dbService) {
          try {
            await dbService.insert('reflexion_history', {
              id: generateId(),
              user_input: body.input,
              user_context: JSON.stringify(body.context || {}),
              analysis_result: JSON.stringify(result.reflexion?.analysis || {}),
              reflection_thoughts: JSON.stringify(result.reflexion?.reflection || []),
              evaluation_score: JSON.stringify(result.reflexion?.evaluation || {}),
              cultural_pause_markers: JSON.stringify(result.reflexion?.cultural_pause || []),
              ai_output: result.output || '',
              ai_model: result.metadata?.model || 'unknown',
              ai_source: result.metadata?.source || 'unknown',
              processing_time_ms: result.metadata?.processing_time_ms || 0,
              ai_enhanced: result.reflexion?.ai_enhanced ? 1 : 0,
              ai_fallback: result.metadata?.ai_fallback ? 1 : 0,
              session_id: requestId,
              ip_address: request.headers.get('CF-Connecting-IP') || null,
              created_at: getCurrentTimestamp()
            });
          } catch (error) {
            console.error('Failed to log reflexion to database:', error);
          }
        }

        return new Response(
          JSON.stringify(result),
          { headers: corsHeaders, status: 200 }
        );
      }

      // Analyze reasoning
      if (path === '/api/v1/reflexion/analyze' || path === '/api/v1/reflexion/analyze/') {
        if (request.method !== 'POST') {
          return new Response(
            JSON.stringify({
              success: false,
              error: { message: 'Method not allowed. Use POST.' }
            }),
            { headers: corsHeaders, status: 405 }
          );
        }

        const body = await request.json().catch(() => null);
        if (!body || !body.text) {
          return new Response(
            JSON.stringify({
              success: false,
              error: { message: 'Request body must include "text" field' }
            }),
            { headers: corsHeaders, status: 400 }
          );
        }

        const result = analyzeReasoning(body.text);
        return new Response(
          JSON.stringify(result),
          { headers: corsHeaders, status: 200 }
        );
      }

      // Reflexion info (GET)
      if (path === '/api/v1/reflexion' || path === '/api/v1/reflexion/') {
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Reflexion API - Cultural AI Alignment',
            description: 'Process input through human-centered reflexion loop',
            methodology: {
              steps: [
                '1. Analyze reasoning patterns',
                '2. Perform self-reflection',
                '3. Evaluate output quality',
                '4. Honor cultural pause'
              ],
              principles: [
                'Clarity',
                'Empathy',
                'Slow thinking',
                'Caribbean cultural awareness',
                'Respeto'
              ]
            },
            endpoints: {
              process: 'POST /api/v1/reflexion/process',
              analyze: 'POST /api/v1/reflexion/analyze'
            },
            example: {
              process: {
                method: 'POST',
                body: {
                  input: 'Kiko ta empatia?',
                  context: {
                    language: 'papiamentu',
                    cultural_context: 'caribbean'
                  }
                }
              },
              analyze: {
                method: 'POST',
                body: {
                  text: 'Empatia ta compronde e otro hende.'
                }
              }
            }
          }),
          { headers: corsHeaders, status: 200 }
        );
      }

      // ===== ADMIN ENDPOINTS =====

      // Database stats endpoint
      if (path === '/api/v1/admin/stats' || path === '/api/v1/admin/stats/') {
        if (!dbEnabled || !dbService || !culturalData) {
          return new Response(
            JSON.stringify({
              success: false,
              error: { message: 'Database is not enabled' }
            }),
            { headers: corsHeaders, status: 503 }
          );
        }

        try {
          // Get database stats
          const dbStats = await dbService.getStats();
          const culturalStats = await culturalData.getStats();
          const popularDatasets = await culturalData.getPopular(10);

          return new Response(
            JSON.stringify({
              success: true,
              database: dbStats.stats,
              cultural_data: culturalStats.stats,
              popular_datasets: popularDatasets.data,
              timestamp: new Date().toISOString()
            }),
            { headers: corsHeaders, status: 200 }
          );
        } catch (error) {
          return new Response(
            JSON.stringify({
              success: false,
              error: { message: error.message }
            }),
            { headers: corsHeaders, status: 500 }
          );
        }
      }

      // Rate limit stats endpoint
      if (path === '/api/v1/admin/rate-limits' || path === '/api/v1/admin/rate-limits/') {
        if (!dbEnabled || !rateLimiter) {
          return new Response(
            JSON.stringify({
              success: false,
              error: { message: 'Rate limiting is not enabled' }
            }),
            { headers: corsHeaders, status: 503 }
          );
        }

        try {
          const clientIp = url.searchParams.get('ip') || null;
          const stats = await rateLimiter.getStats(clientIp);

          return new Response(
            JSON.stringify(stats),
            { headers: corsHeaders, status: 200 }
          );
        } catch (error) {
          return new Response(
            JSON.stringify({
              success: false,
              error: { message: error.message }
            }),
            { headers: corsHeaders, status: 500 }
          );
        }
      }

      // Root endpoint
      if (path === '/' || path === '') {
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Welcome to Reflexhon Global API',
            tagline: 'Cultural AI Alignment for Papiamentu',
            version: '1.5.0',
            status: 'production',
            features: [
              '✅ Cultural Alignment Datasets',
              '✅ Reflexion Processing Engine',
              '✅ HuggingFace Integration (datasets + AI models)',
              dbEnabled ? '✅ D1 Database Integration' : '🚧 D1 Database Integration (pending setup)',
              '✅ API Analytics & Logging',
              rateLimiter ? '✅ Rate Limiting Protection' : '🚧 Rate Limiting (pending setup)'
            ],
            quick_start: {
              health: '/health',
              api_docs: '/api',
              datasets: '/api/v1/datasets',
              reflexion: '/api/v1/reflexion',
              stats: '/api/v1/admin/stats',
              rate_limits: '/api/v1/admin/rate-limits'
            },
            documentation: 'https://github.com/sahidattaf/reflexhon-global'
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
            path: path,
            suggestion: 'Visit /api for available endpoints'
          }
        }),
        { headers: corsHeaders, status: 404 }
      );

    } catch (error) {
      // Log error to database if available
      if (dbEnabled && dbService) {
        try {
          await dbService.insert('api_logs', {
            id: generateId(),
            request_method: request.method,
            request_path: path,
            request_query: JSON.stringify(Object.fromEntries(url.searchParams)),
            response_status: 500,
            response_time_ms: Date.now() - requestStartTime,
            client_ip: request.headers.get('CF-Connecting-IP') || null,
            client_country: request.headers.get('CF-IPCountry') || null,
            client_user_agent: request.headers.get('User-Agent') || null,
            error_type: 'server_error',
            error_message: error.message,
            error_stack: error.stack,
            session_id: requestId,
            request_id: requestId,
            created_at: getCurrentTimestamp()
          });
        } catch (logError) {
          console.error('Failed to log error to database:', logError);
        }
      }

      return new Response(
        JSON.stringify({
          success: false,
          error: {
            message: error.message || 'Internal Server Error',
            type: 'server_error'
          }
        }),
        { headers: corsHeaders, status: 500 }
      );
    }
  }
};
