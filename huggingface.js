// HuggingFace Integration Module
// Connects Cloudflare Workers with HuggingFace Hub

import { AIError, DatasetError, ERROR_CODES, classifyHuggingFaceError } from './utils/errors.js';

/**
 * Fetch dataset from HuggingFace Hub
 * @param {string} datasetName - e.g., "reflexhon-global/reflexhon-datasets"
 * @param {string} token - HuggingFace API token (optional for public datasets)
 */
export async function fetchHuggingFaceDataset(datasetName, token = null) {
  const url = `https://huggingface.co/datasets/${datasetName}/resolve/main/data.jsonl`;

  const headers = {
    'Accept': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      const errorCode = response.status === 404
        ? ERROR_CODES.DATASET_NOT_FOUND
        : ERROR_CODES.DATASET_FETCH_FAILED;

      throw new DatasetError(
        `Failed to fetch dataset: ${response.status} ${response.statusText}`,
        errorCode,
        { dataset: datasetName, status: response.status }
      );
    }

    const text = await response.text();

    // Parse JSONL format (one JSON object per line)
    const datasets = text
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => {
        try {
          return JSON.parse(line);
        } catch (e) {
          return null;
        }
      })
      .filter(item => item !== null);

    if (datasets.length === 0) {
      throw new DatasetError(
        'Dataset is empty or invalid format',
        ERROR_CODES.DATASET_EMPTY,
        { dataset: datasetName }
      );
    }

    return {
      success: true,
      data: datasets,
      total: datasets.length,
      source: 'huggingface',
      dataset_name: datasetName
    };
  } catch (error) {
    // Re-throw if it's already a DatasetError
    if (error instanceof DatasetError) {
      throw error;
    }

    // Wrap unknown errors
    throw new DatasetError(
      error.message,
      ERROR_CODES.DATASET_PARSE_ERROR,
      { dataset: datasetName, originalError: error.message }
    );
  }
}

/**
 * Call HuggingFace Inference API
 * @param {string} model - Model name (e.g., "reflexhon-global/reflexhon-models")
 * @param {string} input - Input text to process
 * @param {string} token - HuggingFace API token
 */
export async function callHuggingFaceInference(model, input, token) {
  const url = `https://api-inference.huggingface.co/models/${model}`;

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const body = JSON.stringify({
    inputs: input,
    parameters: {
      max_new_tokens: 250,
      temperature: 0.7,
      top_p: 0.9,
      do_sample: true
    }
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body
    });

    if (!response.ok) {
      // Try to get detailed error info
      let errorData = null;
      try {
        errorData = await response.json();
      } catch (e) {
        // Ignore JSON parse errors
      }

      // Classify and throw appropriate error
      throw classifyHuggingFaceError(
        { status: response.status, estimated_time: errorData?.estimated_time },
        errorData?.error || `${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();

    // Handle different response formats
    let output;
    if (Array.isArray(result) && result.length > 0) {
      output = result[0].generated_text || result[0].text || result[0];
    } else {
      output = result.generated_text || result;
    }

    return {
      success: true,
      output: output,
      model: model,
      source: 'huggingface_inference'
    };
  } catch (error) {
    // Re-throw if it's already an AIError
    if (error instanceof AIError) {
      throw error;
    }

    // Wrap unknown errors
    throw new AIError(
      error.message,
      ERROR_CODES.AI_INFERENCE_FAILED,
      { model, originalError: error.message }
    );
  }
}

/**
 * Get model info from HuggingFace Hub
 */
export async function getModelInfo(modelName, token = null) {
  const url = `https://huggingface.co/api/models/${modelName}`;

  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to fetch model info: ${response.status}`
      };
    }

    const info = await response.json();

    return {
      success: true,
      model: {
        name: info.modelId,
        author: info.author,
        downloads: info.downloads,
        likes: info.likes,
        pipeline_tag: info.pipeline_tag,
        tags: info.tags
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Check if HuggingFace API token is valid
 */
export async function validateToken(token) {
  const url = 'https://huggingface.co/api/whoami-v2';

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      return { valid: false, error: 'Invalid token' };
    }

    const data = await response.json();
    return {
      valid: true,
      user: data.name,
      orgs: data.orgs || []
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message
    };
  }
}
