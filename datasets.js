// Dataset data - imported from JSONL
// In production, this could be loaded from D1 database
const DATASETS = [
  {
    "id": "papiamentu_001",
    "input": "Kiko ta empatia?",
    "output": "Empatia ta compronde e otro hende.",
    "category": "emotions",
    "language": "papiamentu"
  }
  // More datasets will be added here or loaded from D1
];

export function getAllDatasets() {
  return {
    success: true,
    total: DATASETS.length,
    data: DATASETS,
    metadata: {
      language: "papiamentu",
      purpose: "cultural_alignment",
      last_updated: "2025-12-30"
    }
  };
}

export function getDatasetById(id) {
  const dataset = DATASETS.find(d => d.id === id);

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
    data: dataset
  };
}

export function searchDatasets(query) {
  const results = DATASETS.filter(d =>
    d.input.toLowerCase().includes(query.toLowerCase()) ||
    d.output.toLowerCase().includes(query.toLowerCase())
  );

  return {
    success: true,
    total: results.length,
    query: query,
    data: results
  };
}
