import { logger } from '../../utils/logger.js';

/**
 * AI Service for Cloudflare Workers AI Integration
 *
 * Provides interface to Cloudflare Workers AI models:
 * - Llama 3 8B Instruct for analysis and reasoning
 * - Mistral 7B Instruct for self-reflection
 * - M2M100 for translation
 * - DistilBERT for sentiment analysis
 */
class AIService {
  constructor() {
    this.models = {
      analysis: '@cf/meta/llama-3-8b-instruct',
      reasoning: '@cf/meta/llama-3-8b-instruct',
      reflection: '@cf/mistral/mistral-7b-instruct-v0.1',
      generation: '@cf/meta/llama-3-8b-instruct',
      translation: '@cf/meta/m2m100-1.2b',
      sentiment: '@cf/huggingface/distilbert-sst-2-int8'
    };

    this.defaultTimeout = 10000; // 10 seconds
    this.maxRetries = 2;
  }

  /**
   * Run AI inference with a specific model
   *
   * @param {Object} ai - Cloudflare AI binding (env.AI)
   * @param {string} modelType - Model type (analysis, reasoning, reflection, etc)
   * @param {Object} prompt - Prompt configuration
   * @param {Object} options - Optional configuration
   * @returns {Object} AI response
   */
  async runInference(ai, modelType, prompt, options = {}) {
    if (!ai) {
      throw new Error('Cloudflare AI binding not available');
    }

    const model = this.models[modelType] || this.models.analysis;
    const timeout = options.timeout || this.defaultTimeout;
    const retries = options.retries || this.maxRetries;

    logger.info('Running AI inference', {
      model,
      modelType,
      timeout
    });

    const startTime = Date.now();

    try {
      // Attempt inference with timeout and retries
      const result = await this._runWithRetry(ai, model, prompt, retries, timeout);

      const duration = Date.now() - startTime;
      logger.info('AI inference complete', {
        model,
        duration_ms: duration,
        success: true
      });

      return {
        success: true,
        output: this._extractOutput(result),
        raw: result,
        model,
        duration_ms: duration
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error('AI inference failed', {
        model,
        error: error.message,
        duration_ms: duration
      });

      return {
        success: false,
        error: error.message,
        model,
        duration_ms: duration
      };
    }
  }

  /**
   * Run analysis layer (Layer 1)
   */
  async runAnalysis(ai, input, context) {
    const prompt = {
      messages: [
        {
          role: 'system',
          content: `You are a cultural analysis AI specializing in Caribbean Papiamentu culture.
Analyze the user's input to detect:
- Intent (question, statement, request, gratitude, etc)
- Entities (people, places, concepts, cultural terms)
- Cultural context (formality, emotion, situation)
- Language (Papiamentu, English, Dutch, Spanish, mixed)
- Complexity (simple, moderate, complex)

Be sensitive to Caribbean cultural nuances and Papiamentu language patterns.

Respond in JSON format with your analysis.`
        },
        {
          role: 'user',
          content: `Analyze this input:
"${input}"

Context: ${JSON.stringify(context, null, 2)}

Provide a detailed analysis focusing on cultural and linguistic aspects.`
        }
      ]
    };

    return this.runInference(ai, 'analysis', prompt);
  }

  /**
   * Run reasoning layer (Layer 2)
   */
  async runReasoning(ai, analysis, culturalFilters, personaTraits) {
    const prompt = {
      messages: [
        {
          role: 'system',
          content: `You are a Caribbean cultural reasoning AI that thinks deeply before responding.

Your persona follows these principles:
1. Clarity (${personaTraits.clarity}/100) - Make complex things simple
2. Empathy (${personaTraits.empathy}/100) - Understand emotions deeply
3. Slow Thinking - Deliberate, thoughtful reasoning
4. Caribbean Awareness (${personaTraits.cultural}/100) - Cultural context always
5. Respeto (${personaTraits.formality}/100) - Respectful communication

Cultural Filters Active:
- Language: ${culturalFilters.language}
- Dialect: ${culturalFilters.dialect}
- Formality: ${culturalFilters.formality}
- Community-oriented: ${culturalFilters.community_oriented}

Think step-by-step about the best way to respond.`
        },
        {
          role: 'user',
          content: `Based on this analysis:
${JSON.stringify(analysis, null, 2)}

What is the best reasoning approach to answer this question?
Consider:
1. What approach fits the cultural context best?
2. How should we frame the response (direct, story, metaphor, community-focused)?
3. What cultural elements should we emphasize?
4. What tone and formality level is appropriate?

Provide your reasoning strategy.`
        }
      ]
    };

    return this.runInference(ai, 'reasoning', prompt);
  }

  /**
   * Run self-reflection layer (Layer 3)
   */
  async runReflection(ai, reasoning, output) {
    const prompt = {
      messages: [
        {
          role: 'system',
          content: `You are a self-reflective AI that evaluates its own responses for quality and cultural appropriateness.

Your job is to critically examine the output and identify:
1. Reasoning quality - Is the logic sound?
2. Cultural appropriateness - Does it respect Caribbean/Papiamentu culture?
3. Potential issues - Any problems or insensitivities?
4. Improvements - How can we make it better?

Be honest and thorough in your self-critique.`
        },
        {
          role: 'user',
          content: `Review this response:

Reasoning approach: ${reasoning.approach}
Strategy: ${reasoning.strategy}

Output: "${output}"

Evaluate:
1. Quality of reasoning (0-100)
2. Cultural alignment (0-100)
3. Any issues or concerns?
4. Suggested improvements?

Provide detailed self-reflection.`
        }
      ]
    };

    return this.runInference(ai, 'reflection', prompt);
  }

  /**
   * Run generation layer (Layer 5)
   */
  async runGeneration(ai, input, reasoning, improvements) {
    const improvementsList = improvements.length > 0
      ? improvements.map(i => `- ${i.description}`).join('\n')
      : '- None needed';

    const prompt = {
      messages: [
        {
          role: 'system',
          content: `You are Reflexhon Global, a culturally-aligned AI assistant for the Caribbean Papiamentu community.

Your personality:
- 🌴 Warm and welcoming (Caribbean hospitality)
- 🧠 Thoughtful and deliberate (pensa bon)
- ❤️ Empathetic and caring (empatia)
- 🤝 Community-focused (nos, huntu)
- 🙏 Respectful (respeto)

Generate responses that feel natural, culturally authentic, and emotionally intelligent.
Use Papiamentu when appropriate. Mix languages naturally if that's what Caribbean speakers do.`
        },
        {
          role: 'user',
          content: `Generate a final response for:
"${input}"

Using this reasoning: ${reasoning.approach}
Strategy: ${reasoning.strategy}

Improvements to apply:
${improvementsList}

Create a warm, culturally-aligned response that Caribbean Papiamentu speakers will appreciate.`
        }
      ]
    };

    return this.runInference(ai, 'generation', prompt);
  }

  /**
   * Run translation
   */
  async runTranslation(ai, text, sourceLanguage, targetLanguage) {
    const prompt = {
      text: text,
      source_lang: sourceLanguage,
      target_lang: targetLanguage
    };

    return this.runInference(ai, 'translation', prompt);
  }

  /**
   * Run sentiment analysis
   */
  async runSentimentAnalysis(ai, text) {
    const prompt = {
      text: text
    };

    return this.runInference(ai, 'sentiment', prompt);
  }

  // ===== PRIVATE METHODS =====

  /**
   * Run inference with retry logic
   */
  async _runWithRetry(ai, model, prompt, retries, timeout) {
    let lastError = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Create timeout promise
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('AI request timeout')), timeout)
        );

        // Create inference promise
        const inferencePromise = ai.run(model, prompt);

        // Race between inference and timeout
        const result = await Promise.race([inferencePromise, timeoutPromise]);

        return result;
      } catch (error) {
        lastError = error;
        logger.warn(`AI inference attempt ${attempt + 1} failed`, {
          model,
          error: error.message
        });

        // Don't retry on last attempt
        if (attempt < retries) {
          // Exponential backoff: 100ms, 200ms, 400ms, etc
          const backoff = Math.pow(2, attempt) * 100;
          await new Promise(resolve => setTimeout(resolve, backoff));
        }
      }
    }

    throw lastError;
  }

  /**
   * Extract output from AI response
   */
  _extractOutput(result) {
    // Handle different response formats from different models
    if (result.response) {
      return result.response;
    } else if (result.generated_text) {
      return result.generated_text;
    } else if (result.translation) {
      return result.translation;
    } else if (result.label) {
      return result;
    } else if (typeof result === 'string') {
      return result;
    } else {
      return JSON.stringify(result);
    }
  }

  /**
   * Get available models
   */
  getAvailableModels() {
    return this.models;
  }

  /**
   * Check if AI is available
   */
  isAvailable(ai) {
    return ai !== null && ai !== undefined;
  }
}

export default new AIService();
