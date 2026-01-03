/**
 * Tests for HuggingFace Integration with Error Handling
 */

import {
  fetchHuggingFaceDataset,
  callHuggingFaceInference,
  getModelInfo,
  validateToken
} from '../../huggingface.js';
import { AIError, DatasetError, ERROR_CODES } from '../../utils/errors.js';

// Mock fetch globally
global.fetch = jest.fn();

describe('HuggingFace Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchHuggingFaceDataset', () => {
    it('should fetch and parse JSONL dataset successfully', async () => {
      const mockData =
        '{"id":"1","input":"test1","output":"result1"}\n' +
        '{"id":"2","input":"test2","output":"result2"}';

      global.fetch.mockResolvedValue({
        ok: true,
        text: async () => mockData
      });

      const result = await fetchHuggingFaceDataset('test/dataset', 'token');

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data[0].id).toBe('1');
      expect(result.source).toBe('huggingface');
    });

    it('should throw DatasetError for 404 response', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(
        fetchHuggingFaceDataset('nonexistent/dataset', 'token')
      ).rejects.toThrow(DatasetError);

      await expect(
        fetchHuggingFaceDataset('nonexistent/dataset', 'token')
      ).rejects.toMatchObject({
        errorCode: ERROR_CODES.DATASET_NOT_FOUND
      });
    });

    it('should throw DatasetError for other HTTP errors', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      await expect(
        fetchHuggingFaceDataset('test/dataset', 'token')
      ).rejects.toThrow(DatasetError);

      await expect(
        fetchHuggingFaceDataset('test/dataset', 'token')
      ).rejects.toMatchObject({
        errorCode: ERROR_CODES.DATASET_FETCH_FAILED
      });
    });

    it('should throw DatasetError for empty dataset', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        text: async () => ''
      });

      await expect(
        fetchHuggingFaceDataset('empty/dataset', 'token')
      ).rejects.toThrow(DatasetError);

      await expect(
        fetchHuggingFaceDataset('empty/dataset', 'token')
      ).rejects.toMatchObject({
        errorCode: ERROR_CODES.DATASET_EMPTY
      });
    });

    it('should skip invalid JSON lines gracefully', async () => {
      const mockData =
        '{"id":"1","input":"test1"}\n' +
        'invalid json line\n' +
        '{"id":"2","input":"test2"}';

      global.fetch.mockResolvedValue({
        ok: true,
        text: async () => mockData
      });

      const result = await fetchHuggingFaceDataset('test/dataset', 'token');

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2); // Invalid line skipped
    });

    it('should include authorization header when token is provided', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        text: async () => '{"id":"1"}'
      });

      await fetchHuggingFaceDataset('test/dataset', 'my-token');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer my-token'
          })
        })
      );
    });
  });

  describe('callHuggingFaceInference', () => {
    it('should call inference API successfully', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          generated_text: 'AI generated response'
        })
      });

      const result = await callHuggingFaceInference(
        'google/flan-t5-small',
        'Test prompt',
        'token'
      );

      expect(result.success).toBe(true);
      expect(result.output).toBe('AI generated response');
      expect(result.model).toBe('google/flan-t5-small');
    });

    it('should handle array response format', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => [{
          generated_text: 'Response from array'
        }]
      });

      const result = await callHuggingFaceInference('model', 'prompt', 'token');

      expect(result.success).toBe(true);
      expect(result.output).toBe('Response from array');
    });

    it('should throw AIError for model loading (503)', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 503,
        json: async () => ({
          error: 'Model loading',
          estimated_time: 20
        })
      });

      await expect(
        callHuggingFaceInference('model', 'prompt', 'token')
      ).rejects.toThrow(AIError);

      await expect(
        callHuggingFaceInference('model', 'prompt', 'token')
      ).rejects.toMatchObject({
        errorCode: ERROR_CODES.AI_MODEL_LOADING,
        details: { estimated_time: 20 }
      });
    });

    it('should throw AIError for invalid token (401)', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Unauthorized' })
      });

      await expect(
        callHuggingFaceInference('model', 'prompt', 'bad-token')
      ).rejects.toMatchObject({
        errorCode: ERROR_CODES.AI_INVALID_TOKEN
      });
    });

    it('should throw AIError for rate limit (429)', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 429,
        json: async () => ({ error: 'Rate limit exceeded' })
      });

      await expect(
        callHuggingFaceInference('model', 'prompt', 'token')
      ).rejects.toMatchObject({
        errorCode: ERROR_CODES.AI_RATE_LIMIT
      });
    });

    it('should throw AIError for model not found (404)', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Model not found' })
      });

      await expect(
        callHuggingFaceInference('nonexistent/model', 'prompt', 'token')
      ).rejects.toMatchObject({
        errorCode: ERROR_CODES.AI_MODEL_NOT_FOUND
      });
    });

    it('should include model parameters in request', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ generated_text: 'test' })
      });

      await callHuggingFaceInference('model', 'prompt', 'token');

      const callArgs = global.fetch.mock.calls[0][1];
      const body = JSON.parse(callArgs.body);

      expect(body.inputs).toBe('prompt');
      expect(body.parameters).toBeDefined();
      expect(body.parameters.max_new_tokens).toBeDefined();
      expect(body.parameters.temperature).toBeDefined();
    });
  });

  describe('getModelInfo', () => {
    it('should fetch model information successfully', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          modelId: 'google/flan-t5-small',
          author: 'google',
          downloads: 1000000,
          likes: 500,
          pipeline_tag: 'text2text-generation',
          tags: ['text-generation', 'multilingual']
        })
      });

      const result = await getModelInfo('google/flan-t5-small', 'token');

      expect(result.success).toBe(true);
      expect(result.model.name).toBe('google/flan-t5-small');
      expect(result.model.author).toBe('google');
    });

    it('should handle model info fetch failure', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 404
      });

      const result = await getModelInfo('invalid/model');

      expect(result.success).toBe(false);
      expect(result.error).toContain('404');
    });
  });

  describe('validateToken', () => {
    it('should validate a valid token', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          name: 'testuser',
          orgs: ['org1', 'org2']
        })
      });

      const result = await validateToken('valid-token');

      expect(result.valid).toBe(true);
      expect(result.user).toBe('testuser');
      expect(result.orgs).toEqual(['org1', 'org2']);
    });

    it('should reject an invalid token', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 401
      });

      const result = await validateToken('invalid-token');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid token');
    });

    it('should handle network errors', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));

      const result = await validateToken('token');

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Network error');
    });
  });
});
