# Reflexhon Cloud API Layer - AI Coding Agent Instructions

## Project Overview

**Reflexhon Global** is a human-centered AI ecosystem focused on cultural alignment, creative reasoning, and empathic intelligence—specifically built with Caribbean/Papiamentu cultural awareness. The **Cloud API Layer v1** is a Node.js/Express backend serving as the foundation for enterprise AI services.

### Core Mission
Enable human-centered AI that amplifies creativity, empathy, and local cultural intelligence—not replace human capability.

---

## Architecture & Request Flow

```
Client → server.js → /api/index.js (router) → /routes/* (handlers) 
→ /services/* (business logic) → Response utilities
```

### Key Layers

| Layer | Location | Responsibility |
|-------|----------|-----------------|
| **Routing** | `/routes/*.js` | HTTP endpoint handlers, input validation, response formatting |
| **Services** | `/services/*.js` | Business logic (stateless singletons), no HTTP concerns |
| **Middleware** | `/middleware/*.js` | Security (helmet), logging (morgan), error handling |
| **Utils** | `/utils/*.js` | Shared helpers: `asyncHandler`, `logger`, response formatting |
| **Config** | `/config/*.js` | Constants, environment variables, API metadata |

### Critical Pattern: Service Singleton Instances
Services are instantiated once and exported as singletons:
```javascript
// reflexionService.js
class ReflexionService { /* methods */ }
export default new ReflexionService();  // Singleton, not class
```
Routes import and use directly: `import reflexionService from '../services/reflexionService.js'`

---

## Module System & ES Modules

**All code uses ES Modules** (`type: "module"` in package.json).

- ✅ Always include `.js` file extensions in imports
- ✅ Use `import`/`export` syntax (not `require`)
- ✅ Example: `import { asyncHandler } from '../utils/asyncHandler.js'`

---

## Core Code Patterns

### 1. Adding a New Endpoint

**Step 1: Create service** (`/services/myService.js`)
```javascript
import { logger } from '../utils/logger.js';

class MyService {
  async doSomething(params) {
    try {
      logger.info('Executing doSomething', { params });
      // Business logic here
      return { result: 'success' };
    } catch (error) {
      logger.error('Failed to doSomething', error);
      throw error;  // Let route handler catch
    }
  }
}

export default new MyService();
```

**Step 2: Create route handler** (`/routes/myRoutes.js`)
```javascript
import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { HTTP_STATUS } from '../config/constants.js';
import myService from '../services/myService.js';

const router = express.Router();

router.post('/', asyncHandler(async (req, res) => {
  const { input } = req.body;
  if (!input) return errorResponse(res, 'Input required', HTTP_STATUS.BAD_REQUEST);
  
  const result = await myService.doSomething(input);
  return successResponse(res, result, 'Success', HTTP_STATUS.CREATED);
}));

export default router;
```

**Step 3: Register route** in `/api/index.js`
```javascript
import myRoutes from '../routes/myRoutes.js';
v1Router.use('/my-endpoint', myRoutes);
```

### 2. Error Handling

- ✅ Wrap async route handlers with `asyncHandler` (catches Promise rejections)
- ✅ Services throw errors; middleware catches them
- ✅ Global `errorHandler` middleware formats error responses
- ✅ Never use `throw new Error()` in routes—service layer handles business errors

**Example:**
```javascript
// Service throws specific error
throw new Error('Cultural alignment not found');

// Route's asyncHandler catches it → errorHandler formats response
```

### 3. Response Format

All responses use helper functions (`/utils/response.js`):

**Success:**
```javascript
successResponse(res, data, message, statusCode)
// Returns: { success: true, message: "...", data: {...} }
```

**Error:**
```javascript
errorResponse(res, message, statusCode)
// Returns: { success: false, error: { message: "..." } }
// (includes stack trace in development only)
```

### 4. Logging

Use `/utils/logger.js` instead of `console.log`:
```javascript
import { logger } from '../utils/logger.js';

logger.info('User created', { userId: 123, email: 'user@example.com' });
logger.error('Database connection failed', error);
```

---

## Reflexhon-Specific Knowledge

### Cultural Alignment Features
- **Datasets:** `/ai/datasets/data.jsonl` and `/huggingface/datasets/data.jsonl` contain training data for cultural alignment
- **Endpoints:** `/api/v1/reflexion/alignment` performs cultural reasoning (currently Papiamentu-aware)
- **Philosophy:** See `/docs/philosophy/reflexhon_methodology.md` for the reasoning framework

### Key Endpoints (Current Implementation)
- `POST /api/v1/reflexion/process` - Process user input with reflexion logic
- `POST /api/v1/reflexion/alignment` - Get cultural alignment score
- `GET /api/v1/datasets` - List available datasets
- `GET /health` - Service health check

---

## Development Workflow

### Common Commands
```bash
npm run dev         # Start with auto-reload (nodemon)
npm start           # Start production
npm test            # Run Jest tests
npm run lint        # Run ESLint
cp .env.example .env # Setup environment
```

### Environment Variables
Configure via `.env`:
- `PORT` - API port (default: 3000)
- `NODE_ENV` - development/production
- `API_VERSION` - API version prefix (default: v1)

### Testing
- Jest configuration expected in project root or `jest.config.js`
- Test files follow `*.test.js` or `*.spec.js` pattern
- Run with `npm test`

---

## Deployment & Cloud Configuration

### Docker Deployment
- **Dockerfile** uses Node.js 18 Alpine (production-optimized)
- **.dockerignore** excludes node_modules, .git, FETCH_HEAD
- Build: `docker build -t reflexhon-cloud-api:latest .`
- Run: `docker run -p 3000:3000 reflexhon-cloud-api:latest`

### Cloudflare Workers
- **cloudflare.yaml** defines dev/staging/production environments
- Environment-specific bindings for D1 (database) and KV (cache)
- Deploy with: `wrangler deploy --env production`

### CI/CD (GitHub Actions)
- `.github/workflows/deploy-cloudflare.yml` handles automated deployment
- Staging deploys on `reflexhon-cloud-v1` branch
- Production deploys on `main` branch (requires tests to pass)

---

## File Structure Reference

```
/routes/*.js           → HTTP handlers (import service, validate input, format response)
/services/*.js         → Business logic (pure logic, no HTTP)
/middleware/*.js       → Express middleware (security, logging, error handling)
/utils/*.js           → Shared helpers (asyncHandler, logger, response utils)
/config/*.js          → Constants and configuration
/api/index.js         → API router (manages versioning)
/docs/*.md            → Architecture and integration documentation
/ai/datasets/         → Cultural alignment training data (JSONL format)
```

---

## Important Conventions

| Convention | Rule | Example |
|-----------|------|---------|
| **Naming** | camelCase for functions/vars, PascalCase for classes | `getReflexionData()`, `class ReflexionService` |
| **Async Operations** | Always wrap in `asyncHandler` | `router.post('/', asyncHandler(async (req, res) => {...}))` |
| **Service Methods** | Always async, throw on error | `async getCulturalAlignment(text) { ... }` |
| **HTTP Status** | Use constants from `config/constants.js` | `HTTP_STATUS.CREATED` not `201` |
| **Validation** | Validate in route handler, throw in service | Check `req.body` in route, business logic in service |
| **Logging** | Use logger utility for all output | `logger.info()`, `logger.error()` |
| **Response** | Use helper functions consistently | `successResponse()`, `errorResponse()` |

---

## Common Tasks

### Add a New Route
1. Create service in `/services/[feature]Service.js`
2. Create route handler in `/routes/[feature]Routes.js` using the pattern above
3. Register in `/api/index.js`: `v1Router.use('/feature', featureRoutes)`
4. Test with: `npm test` and `npm run dev`

### Update Error Handling
- Global handler in `/middleware/errorHandler.js` formats all errors
- Custom status codes: Define in `/config/constants.js` HTTP_STATUS
- Development includes stack traces; production hides them

### Add Environment Variable
1. Add to `.env.example` with description
2. Reference in `/config/index.js` via `process.env.VAR_NAME`
3. Use throughout app via `import { config } from '../config/index.js'`

### Integrate External API
- Create service method for API calls
- Use logger for request/response tracking
- Handle errors at service layer, not routes
- Example: `/services/reflexionService.js` shows placeholder pattern

---

## Quick References

- **HTTP Constants:** `/config/constants.js`
- **Error Handling Middleware:** `/middleware/errorHandler.js`
- **Response Formatting:** `/utils/response.js`
- **Async Wrapper:** `/utils/asyncHandler.js`
- **Logger Utility:** `/utils/logger.js`
- **API Architecture:** `/docs/ARCHITECTURE.md`
- **Reflexhon Methodology:** `/docs/philosophy/reflexhon_methodology.md`

---

## Questions? Ask About:
- How the service-to-route data flow works
- Why services are singletons vs. class instances
- Cultural alignment scoring logic in `/ai/datasets/`
- Deployment environment differences (dev vs staging vs production)
- Adding middleware to specific routes vs. globally
