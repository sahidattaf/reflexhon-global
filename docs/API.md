# Reflexhon Global API Documentation

## Overview

The Reflexhon Global Cloud API provides endpoints for cultural alignment processing and dataset management.

**Base URL**: `http://localhost:3000/api/v1`

## Authentication

Currently, the API is open for development. Authentication will be added in future versions.

## Endpoints

### Health Check

#### GET `/health`
Check API health status.

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2025-11-30T00:00:00.000Z"
}
```

### API Info

#### GET `/api`
Get API information and available endpoints.

**Response**:
```json
{
  "name": "Reflexhon Global API",
  "version": "v1",
  "status": "active",
  "endpoints": {
    "datasets": "/api/v1/datasets",
    "reflexion": "/api/v1/reflexion"
  }
}
```

### Datasets

#### GET `/api/v1/datasets`
Retrieve all dataset entries.

**Response**:
```json
{
  "success": true,
  "message": "Dataset retrieved successfully",
  "data": [
    {
      "id": "papiamentu_001",
      "input": "Kiko ta empatia?",
      "output": "Empatia ta compronde e otro hende."
    }
  ]
}
```

#### GET `/api/v1/datasets/:id`
Retrieve a specific dataset entry by ID.

**Parameters**:
- `id` (string): Dataset entry ID

**Response**:
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "id": "papiamentu_001",
    "input": "Kiko ta empatia?",
    "output": "Empatia ta compronde e otro hende."
  }
}
```

#### GET `/api/v1/datasets/search?q=query`
Search dataset entries.

**Query Parameters**:
- `q` (string, required): Search query

**Response**:
```json
{
  "success": true,
  "message": "Search completed successfully",
  "data": [...]
}
```

### Reflexion

#### POST `/api/v1/reflexion/process`
Process a reflexion input.

**Request Body**:
```json
{
  "input": "Your reflexion input"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Reflexion processed successfully",
  "data": {
    "input": "Your reflexion input",
    "processed": true,
    "timestamp": "2025-11-30T00:00:00.000Z"
  }
}
```

#### POST `/api/v1/reflexion/alignment`
Get cultural alignment for text.

**Request Body**:
```json
{
  "text": "Text to analyze"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Cultural alignment retrieved successfully",
  "data": {
    "text": "Text to analyze",
    "alignment": "papiamentu",
    "confidence": 0.95
  }
}
```

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "message": "Error description"
  }
}
```

### HTTP Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Rate Limiting

Rate limiting will be implemented in future versions.
