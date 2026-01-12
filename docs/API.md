# Reflexhon Global API Documentation

**Version:** 2.0.0
**Status:** Production
**Base URL:** `https://reflexhon-global.sahidattaf.workers.dev`

---

## Table of Contents

- [Overview](#overview)
- [Rate Limiting](#rate-limiting)
- [Caching](#caching)
- [Endpoints](#endpoints)
- [Response Format](#response-format)
- [Error Handling](#error-handling)

---

## Overview

Reflexhon Global is a Cultural AI Alignment API for Papiamentu language and Caribbean cultural contexts.

**Features:**
- 🗂️ Cultural Datasets - 70+ Papiamentu cultural expressions
- 🧠 Reflexion Processing - AI-powered cultural alignment
- 📊 Analytics Dashboard - Real-time usage insights
- 🎯 Smart Recommendations - Hybrid AI recommendations
- ⚡ Edge Caching - Sub-100ms global CDN responses
- 🛡️ Rate Limiting - Intelligent traffic protection

---

## Rate Limiting

**Default:** 100 requests/hour per IP

**Endpoint-Specific Limits:**
- `/api/v1/datasets/search`: 30 req/min
- `/api/v1/reflexion/process`: 10 req/min
- `/api/v1/datasets/categories`: 60 req/min

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1736640000000
```

---

## Caching

**Edge Caching with Cloudflare CDN:**
- Categories: 30 minutes
- Search: 5 minutes
- Dataset by ID: 1 hour

**Headers:**
```
X-Cache: HIT|MISS
Cache-Control: public, max-age=1800
```

---

## Endpoints

### Quick Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/v1/datasets` | List datasets |
| GET | `/api/v1/datasets/categories` | Get categories |
| GET | `/api/v1/datasets/:id` | Get dataset |
| GET | `/api/v1/datasets/search?q=` | Search datasets |
| GET | `/api/v1/datasets/:id/recommendations` | Get recommendations |
| GET | `/api/v1/analytics/dashboard` | Analytics overview |
| POST | `/api/v1/reflexion/process` | Process reflexion |

For complete documentation, see: https://github.com/sahidattaf/reflexhon-global

---

## Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": { "message": "..." }
}
```

---

## Error Handling

| Code | Meaning |
|------|---------|
| 200 | OK |
| 400 | Bad Request |
| 404 | Not Found |
| 429 | Rate Limit Exceeded |
| 500 | Server Error |

---

**Last Updated:** 2026-01-12  
**API Version:** 2.0.0
