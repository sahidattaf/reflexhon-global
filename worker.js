// Cloudflare Workers entry point
// Reflexhon Global API - Cultural AI Alignment

import { getAllDatasets, getDatasetById, searchDatasets } from './datasets.js';
import { processReflexion, analyzeReasoning } from './reflexion.js';

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
            environment: env.NODE_ENV || 'production',
            version: '1.2.0',
            features: {
              datasets: 'enabled',
              reflexion: 'enabled',
              huggingface_datasets: env.HF_TOKEN ? 'enabled' : 'disabled',
              huggingface_ai: (env.HF_TOKEN && env.HF_MODEL) ? 'enabled' : 'disabled',
              database: 'coming_soon'
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
                  description: 'List all cultural alignment datasets'
                },
                get: {
                  path: '/api/v1/datasets/:id',
                  method: 'GET',
                  description: 'Get specific dataset by ID'
                },
                search: {
                  path: '/api/v1/datasets/search?q=query',
                  method: 'GET',
                  description: 'Search datasets by content'
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

      // List all datasets (async - tries HuggingFace first)
      if (path === '/api/v1/datasets' || path === '/api/v1/datasets/') {
        const result = await getAllDatasets(env);
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

        const result = searchDatasets(query);
        return new Response(
          JSON.stringify(result),
          { headers: corsHeaders, status: 200 }
        );
      }

      // Get dataset by ID
      const datasetIdMatch = path.match(/^\/api\/v1\/datasets\/([^\/]+)\/?$/);
      if (datasetIdMatch) {
        const id = datasetIdMatch[1];
        const result = getDatasetById(id);
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

      // Root endpoint
      if (path === '/' || path === '') {
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Welcome to Reflexhon Global API',
            tagline: 'Cultural AI Alignment for Papiamentu',
            version: '1.2.0',
            status: 'production',
            features: [
              '✅ Cultural Alignment Datasets',
              '✅ Reflexion Processing Engine',
              '✅ HuggingFace Integration (datasets + AI models)',
              '🚧 D1 Database Integration (coming soon)',
              '🚧 Advanced Analytics (coming soon)'
            ],
            quick_start: {
              health: '/health',
              api_docs: '/api',
              datasets: '/api/v1/datasets',
              reflexion: '/api/v1/reflexion'
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
