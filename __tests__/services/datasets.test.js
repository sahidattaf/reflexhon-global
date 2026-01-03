/**
 * Tests for Dataset Service with Error Handling
 */

import {
  getAllDatasets,
  getAllDatasetsSync,
  getDatasetById,
  searchDatasets
} from '../../datasets.js';
import * as huggingface from '../../huggingface.js';
import { DatasetError, ERROR_CODES } from '../../utils/errors.js';

// Mock the HuggingFace module
jest.mock('../../huggingface.js');

describe('Dataset Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllDatasets', () => {
    it('should return fallback datasets when no HF_TOKEN is provided', async () => {
      const result = await getAllDatasets({});

      expect(result.success).toBe(true);
      expect(result.total).toBeGreaterThan(0);
      expect(result.data).toBeDefined();
      expect(result.metadata.source).toBe('local_fallback');
      expect(result.metadata.language).toBe('papiamentu');
    });

    it('should fetch from HuggingFace when token is available', async () => {
      const mockHFData = [
        { id: 'hf_001', input: 'Test 1', output: 'Result 1' },
        { id: 'hf_002', input: 'Test 2', output: 'Result 2' }
      ];

      huggingface.fetchHuggingFaceDataset.mockResolvedValue({
        success: true,
        data: mockHFData,
        total: 2,
        source: 'huggingface'
      });

      const result = await getAllDatasets({ HF_TOKEN: 'test-token' });

      expect(result.success).toBe(true);
      expect(result.total).toBe(2);
      expect(result.metadata.source).toBe('huggingface');
      expect(result.data).toEqual(mockHFData);
    });

    it('should cache HuggingFace datasets', async () => {
      const mockData = [{ id: '1', input: 'test' }];

      huggingface.fetchHuggingFaceDataset.mockResolvedValue({
        success: true,
        data: mockData
      });

      // First call
      await getAllDatasets({ HF_TOKEN: 'token' });

      // Second call should use cache
      const result = await getAllDatasets({ HF_TOKEN: 'token' });

      expect(result.metadata.source).toBe('huggingface_cached');
      expect(huggingface.fetchHuggingFaceDataset).toHaveBeenCalledTimes(1);
    });

    it('should fall back to local datasets on HuggingFace error', async () => {
      huggingface.fetchHuggingFaceDataset.mockRejectedValue(
        new DatasetError('Fetch failed', ERROR_CODES.DATASET_FETCH_FAILED)
      );

      const result = await getAllDatasets({ HF_TOKEN: 'token' });

      expect(result.success).toBe(true);
      expect(result.metadata.source).toBe('local_fallback');
      expect(result.data).toBeDefined();
    });

    it('should fall back on empty HuggingFace dataset', async () => {
      huggingface.fetchHuggingFaceDataset.mockResolvedValue({
        success: true,
        data: [],
        total: 0
      });

      const result = await getAllDatasets({ HF_TOKEN: 'token' });

      expect(result.metadata.source).toBe('local_fallback');
    });

    it('should handle network errors gracefully', async () => {
      huggingface.fetchHuggingFaceDataset.mockRejectedValue(
        new Error('Network timeout')
      );

      const result = await getAllDatasets({ HF_TOKEN: 'token' });

      // Should still succeed with fallback
      expect(result.success).toBe(true);
      expect(result.metadata.source).toBe('local_fallback');
    });
  });

  describe('getAllDatasetsSync', () => {
    it('should return fallback datasets when no cache exists', () => {
      const result = getAllDatasetsSync();

      expect(result.success).toBe(true);
      expect(result.total).toBeGreaterThan(0);
      expect(result.metadata.source).toBe('local');
    });

    it('should return cached datasets when available', async () => {
      // First populate cache via async call
      huggingface.fetchHuggingFaceDataset.mockResolvedValue({
        success: true,
        data: [{ id: 'cached', input: 'test' }]
      });

      await getAllDatasets({ HF_TOKEN: 'token' });

      // Then get sync
      const result = getAllDatasetsSync();

      expect(result.data[0].id).toBe('cached');
      expect(result.metadata.source).toBe('cached');
    });
  });

  describe('getDatasetById', () => {
    it('should find dataset by id', () => {
      const result = getDatasetById('papiamentu_001');

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.id).toBe('papiamentu_001');
    });

    it('should return error for non-existent id', () => {
      const result = getDatasetById('nonexistent_id');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error.message).toBe('Dataset not found');
      expect(result.error.id).toBe('nonexistent_id');
    });

    it('should search in cached datasets when available', async () => {
      // Populate cache first
      huggingface.fetchHuggingFaceDataset.mockResolvedValue({
        success: true,
        data: [{ id: 'hf_test', input: 'test' }]
      });

      await getAllDatasets({ HF_TOKEN: 'token' });

      const result = getDatasetById('hf_test');

      expect(result.success).toBe(true);
      expect(result.data.id).toBe('hf_test');
      expect(result.source).toBe('huggingface');
    });
  });

  describe('searchDatasets', () => {
    it('should find datasets matching query in input', () => {
      const result = searchDatasets('empatia');

      expect(result.success).toBe(true);
      expect(result.total).toBeGreaterThan(0);
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.query).toBe('empatia');
    });

    it('should find datasets matching query in output', () => {
      const result = searchDatasets('compronde');

      expect(result.success).toBe(true);
      expect(result.total).toBeGreaterThan(0);
    });

    it('should be case insensitive', () => {
      const lowerResult = searchDatasets('empatia');
      const upperResult = searchDatasets('EMPATIA');

      expect(lowerResult.total).toBe(upperResult.total);
    });

    it('should return empty results for non-matching query', () => {
      const result = searchDatasets('xyzabc123nonexistent');

      expect(result.success).toBe(true);
      expect(result.total).toBe(0);
      expect(result.data).toEqual([]);
    });

    it('should search in cached datasets when available', async () => {
      // Populate cache
      huggingface.fetchHuggingFaceDataset.mockResolvedValue({
        success: true,
        data: [{ id: 'hf_1', input: 'unique_search_term', output: 'result' }]
      });

      await getAllDatasets({ HF_TOKEN: 'token' });

      const result = searchDatasets('unique_search_term');

      expect(result.success).toBe(true);
      expect(result.total).toBe(1);
      expect(result.source).toBe('huggingface');
    });
  });

  describe('Dataset Validation', () => {
    it('should have valid dataset structure', async () => {
      const result = await getAllDatasets({});

      result.data.forEach(dataset => {
        expect(dataset).toHaveProperty('id');
        expect(dataset).toHaveProperty('input');
        expect(dataset).toHaveProperty('output');
        expect(typeof dataset.id).toBe('string');
        expect(typeof dataset.input).toBe('string');
        expect(typeof dataset.output).toBe('string');
      });
    });

    it('should have Papiamentu language metadata', async () => {
      const result = await getAllDatasets({});

      expect(result.metadata.language).toBe('papiamentu');
      expect(result.metadata.purpose).toBe('cultural_alignment');
    });

    it('should include last_updated timestamp', async () => {
      const result = await getAllDatasets({});

      expect(result.metadata.last_updated).toBeDefined();
    });

    it('should return consistent data structure', async () => {
      const result = await getAllDatasets({});

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('metadata');
      expect(Array.isArray(result.data)).toBe(true);
    });
  });
});
