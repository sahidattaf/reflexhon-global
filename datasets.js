// Dataset data - imported from JSONL
// In production, this could be loaded from D1 database or HuggingFace
import { fetchHuggingFaceDataset } from './huggingface.js';

const FALLBACK_DATASETS = [
  {
    "id": "papiamentu_001",
    "input": "Kiko ta empatia?",
    "output": "Empatia ta compronde e otro hende.",
    "category": "emotions",
    "language": "papiamentu"
  },
  {
    "id": "papiamentu_002",
    "input": "Kiko ta respeto?",
    "output": "Respeto ta balora e otro hende ku su opinion i sentimento.",
    "category": "values",
    "language": "papiamentu"
  },
  {
    "id": "papiamentu_003",
    "input": "Pakiko famia ta importante?",
    "output": "Famia ta e base di nos komunidat i nos kultura.",
    "category": "family",
    "language": "papiamentu"
  }
  // More datasets will be added here or loaded from D1
];

// Cache for HuggingFace datasets (in-memory, resets on Worker restart)
// Cache cleared on deployment to pick up latest HuggingFace data
let CACHED_DATASETS = null;
let CACHE_TIMESTAMP = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

/**
 * Get all datasets - tries HuggingFace first, falls back to local
 * @param {object} env - Cloudflare environment variables
 */
export async function getAllDatasets(env = {}) {
  // Check cache first
  const now = Date.now();
  if (CACHED_DATASETS && CACHE_TIMESTAMP && (now - CACHE_TIMESTAMP < CACHE_TTL)) {
    return {
      success: true,
      total: CACHED_DATASETS.length,
      data: CACHED_DATASETS,
      metadata: {
        language: "papiamentu",
        purpose: "cultural_alignment",
        last_updated: new Date(CACHE_TIMESTAMP).toISOString(),
        source: "huggingface_cached"
      }
    };
  }

  // Try to fetch from HuggingFace if token is available
  if (env.HF_TOKEN) {
    const hfResult = await fetchHuggingFaceDataset(
      'reflexhon-global/reflexhon-datasets',
      env.HF_TOKEN
    );

    if (hfResult.success && hfResult.data.length > 0) {
      // Cache the results
      CACHED_DATASETS = hfResult.data;
      CACHE_TIMESTAMP = now;

      return {
        success: true,
        total: hfResult.data.length,
        data: hfResult.data,
        metadata: {
          language: "papiamentu",
          purpose: "cultural_alignment",
          last_updated: new Date().toISOString(),
          source: "huggingface",
          dataset_name: "reflexhon-global/reflexhon-datasets"
        }
      };
    }
  }

  // Fallback to local datasets
  return {
    success: true,
    total: FALLBACK_DATASETS.length,
    data: FALLBACK_DATASETS,
    metadata: {
      language: "papiamentu",
      purpose: "cultural_alignment",
      last_updated: "2025-12-30",
      source: "local_fallback",
      note: "Add HF_TOKEN to environment to load from HuggingFace"
    }
  };
}

/**
 * Synchronous version for backwards compatibility
 */
export function getAllDatasetsSync() {
  return {
    success: true,
    total: CACHED_DATASETS ? CACHED_DATASETS.length : FALLBACK_DATASETS.length,
    data: CACHED_DATASETS || FALLBACK_DATASETS,
    metadata: {
      language: "papiamentu",
      purpose: "cultural_alignment",
      last_updated: CACHE_TIMESTAMP ? new Date(CACHE_TIMESTAMP).toISOString() : "2025-12-30",
      source: CACHED_DATASETS ? "cached" : "local"
    }
  };
}

export function getDatasetById(id) {
  const datasets = CACHED_DATASETS || FALLBACK_DATASETS;
  const dataset = datasets.find(d => d.id === id);

  if (!dataset) {
    return {
      success: false,
      error: {
        message: "Dataset not found",
        id: id
      }
    };
  }

  return {
    success: true,
    data: dataset,
    source: CACHED_DATASETS ? "huggingface" : "local"
  };
}

export function searchDatasets(query) {
  const datasets = CACHED_DATASETS || FALLBACK_DATASETS;
  const results = datasets.filter(d =>
    d.input.toLowerCase().includes(query.toLowerCase()) ||
    d.output.toLowerCase().includes(query.toLowerCase())
  );

  return {
    success: true,
    total: results.length,
    query: query,
    data: results,
    source: CACHED_DATASETS ? "huggingface" : "local"
  };
}
