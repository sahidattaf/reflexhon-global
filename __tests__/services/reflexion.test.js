/**
 * Tests for Reflexion Engine with AI Error Debugging
 */

import { processReflexion } from '../../reflexion.js';
import * as huggingface from '../../huggingface.js';
import { AIError, ERROR_CODES } from '../../utils/errors.js';

// Mock the HuggingFace module
jest.mock('../../huggingface.js');

describe('Reflexion Engine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Processing', () => {
    it('should process input without AI when no HF_TOKEN is provided', async () => {
      const result = await processReflexion('Kiko ta empatia?', {}, {});

      expect(result.success).toBe(true);
      expect(result.input).toBe('Kiko ta empatia?');
      expect(result.metadata.source).toBe('rule_based');
      expect(result.metadata.ai_fallback).toBeUndefined();
      expect(result.reflexion.ai_enhanced).toBe(false);
    });

    it('should analyze reasoning correctly', async () => {
      const result = await processReflexion(
        'Kiko ta empatia?',
        { language: 'papiamentu', cultural_context: 'caribbean' },
        {}
      );

      expect(result.reflexion.analysis).toBeDefined();
      expect(result.metadata.language).toBe('papiamentu');
      expect(result.metadata.cultural_context).toBe('caribbean');
    });

    it('should measure processing time', async () => {
      const result = await processReflexion('Test input', {}, {});

      expect(result.metadata.processing_time_ms).toBeGreaterThanOrEqual(0);
      expect(typeof result.metadata.processing_time_ms).toBe('number');
    });
  });

  describe('AI-Enhanced Processing', () => {
    it('should use AI when HF_TOKEN and HF_MODEL are provided', async () => {
      huggingface.callHuggingFaceInference.mockResolvedValue({
        success: true,
        output: 'Empatia ta compronde e otro hende.',
        model: 'google/flan-t5-small',
        source: 'huggingface_inference'
      });

      const env = {
        HF_TOKEN: 'test-token',
        HF_MODEL: 'google/flan-t5-small'
      };

      const result = await processReflexion('Kiko ta empatia?', {}, env);

      expect(result.success).toBe(true);
      expect(result.output).toBe('Empatia ta compronde e otro hende.');
      expect(result.metadata.source).toBe('huggingface_ai');
      expect(result.reflexion.ai_enhanced).toBe(true);
      expect(result.metadata.ai_fallback).toBeUndefined();
    });

    it('should build culturally-aware prompts for AI', async () => {
      huggingface.callHuggingFaceInference.mockResolvedValue({
        success: true,
        output: 'Response',
        model: 'test-model'
      });

      const context = {
        language: 'papiamentu',
        cultural_context: 'caribbean'
      };

      await processReflexion('Test question?', context, {
        HF_TOKEN: 'token',
        HF_MODEL: 'model'
      });

      expect(huggingface.callHuggingFaceInference).toHaveBeenCalled();
      const promptArg = huggingface.callHuggingFaceInference.mock.calls[0][1];
      expect(promptArg).toContain('culturally-aware');
      expect(promptArg).toContain('Test question?');
    });
  });

  describe('AI Error Debugging', () => {
    it('should capture and report AI errors with user-friendly messages', async () => {
      const aiError = new AIError(
        'The AI model is currently loading. Please retry in a few seconds.',
        ERROR_CODES.AI_MODEL_LOADING,
        { estimated_time: 20 }
      );

      huggingface.callHuggingFaceInference.mockRejectedValue(aiError);

      const env = {
        HF_TOKEN: 'test-token',
        HF_MODEL: 'google/flan-t5-small'
      };

      const result = await processReflexion('Test input', {}, env);

      // Should still succeed with fallback
      expect(result.success).toBe(true);
      expect(result.metadata.source).toBe('rule_based');
      expect(result.metadata.ai_fallback).toBe(true);

      // Should include error details
      expect(result.metadata.ai_error).toBeDefined();
      expect(result.metadata.ai_error.message).toContain('loading');
      expect(result.metadata.ai_error.code).toBe(ERROR_CODES.AI_MODEL_LOADING);
      expect(result.metadata.ai_error.details.estimated_time).toBe(20);
    });

    it('should handle AI rate limit errors gracefully', async () => {
      const aiError = new AIError(
        'AI service rate limit reached. Please try again shortly.',
        ERROR_CODES.AI_RATE_LIMIT
      );

      huggingface.callHuggingFaceInference.mockRejectedValue(aiError);

      const result = await processReflexion('Test', {}, {
        HF_TOKEN: 'token',
        HF_MODEL: 'model'
      });

      expect(result.success).toBe(true);
      expect(result.metadata.ai_error.code).toBe(ERROR_CODES.AI_RATE_LIMIT);
      expect(result.metadata.ai_error.message).toContain('rate limit');
    });

    it('should handle invalid token errors', async () => {
      const aiError = new AIError(
        'Invalid HuggingFace API token. Please check your configuration.',
        ERROR_CODES.AI_INVALID_TOKEN
      );

      huggingface.callHuggingFaceInference.mockRejectedValue(aiError);

      const result = await processReflexion('Test', {}, {
        HF_TOKEN: 'bad-token',
        HF_MODEL: 'model'
      });

      expect(result.success).toBe(true);
      expect(result.metadata.ai_error.code).toBe(ERROR_CODES.AI_INVALID_TOKEN);
      expect(result.metadata.ai_error.message).toContain('token');
    });

    it('should handle model not found errors', async () => {
      const aiError = new AIError(
        'The specified AI model was not found on HuggingFace.',
        ERROR_CODES.AI_MODEL_NOT_FOUND
      );

      huggingface.callHuggingFaceInference.mockRejectedValue(aiError);

      const result = await processReflexion('Test', {}, {
        HF_TOKEN: 'token',
        HF_MODEL: 'nonexistent/model'
      });

      expect(result.metadata.ai_error.code).toBe(ERROR_CODES.AI_MODEL_NOT_FOUND);
    });

    it('should handle generic AI errors', async () => {
      const genericError = new Error('Network timeout');

      huggingface.callHuggingFaceInference.mockRejectedValue(genericError);

      const result = await processReflexion('Test', {}, {
        HF_TOKEN: 'token',
        HF_MODEL: 'model'
      });

      expect(result.success).toBe(true);
      expect(result.metadata.ai_error).toBeDefined();
      expect(result.metadata.ai_error.message).toContain('fallback');
    });

    it('should not include ai_error when AI succeeds', async () => {
      huggingface.callHuggingFaceInference.mockResolvedValue({
        success: true,
        output: 'Success',
        model: 'test'
      });

      const result = await processReflexion('Test', {}, {
        HF_TOKEN: 'token',
        HF_MODEL: 'model'
      });

      expect(result.metadata.ai_error).toBeUndefined();
      expect(result.metadata.ai_fallback).toBeUndefined();
    });
  });

  describe('Cultural Context', () => {
    it('should detect emotional content', async () => {
      const result = await processReflexion('Kiko ta amor i empatia?', {}, {});

      expect(result.reflexion.analysis.emotional_depth).toBe('high');
    });

    it('should detect cultural markers', async () => {
      const result = await processReflexion('Nos famia i komunidat', {}, {});

      expect(result.reflexion.analysis.cultural_relevance).toBe('strong');
    });

    it('should include cultural pause markers', async () => {
      const result = await processReflexion('Test', {}, {});

      expect(result.reflexion.cultural_pause).toBeDefined();
      expect(Array.isArray(result.reflexion.cultural_pause)).toBe(true);
      expect(result.reflexion.cultural_pause.length).toBeGreaterThan(0);
    });
  });
});
