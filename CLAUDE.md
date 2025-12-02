# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the Application
```bash
npm run dev      # Start development server with auto-reload (uses nodemon)
npm start        # Start production server
```

The API runs on port 3000 by default (configurable via `.env` file).

### Testing and Linting
```bash
npm test         # Run Jest tests
npm run lint     # Run ESLint
```

### Environment Setup
```bash
cp .env.example .env   # Create environment file
npm install            # Install dependencies
```

## Architecture Overview

This is a Node.js Express API following a layered architecture pattern:

**Request Flow**: Client → `server.js` → API Router (`/api`) → Routes (`/routes`) → Services (`/services`) → Data Source

### Key Directories

- **`/api`**: API versioning and endpoint organization. The main router (`api/index.js`) manages version routing (v1, v2, etc.)
- **`/routes`**: HTTP route handlers. Each file exports an Express router handling a specific domain (datasets, reflexion)
- **`/services`**: Business logic layer. Services are independent of HTTP and handle core functionality
- **`/utils`**: Shared utilities (asyncHandler, logger, response helpers)
- **`/middleware`**: Express middleware (errorHandler, notFound, validateRequest)
- **`/config`**: Configuration files and constants
- **`/ai/datasets`**: JSONL dataset files for cultural alignment training
- **`/docs`**: API and architecture documentation

### Module System
This project uses **ES Modules** (`type: "module"` in package.json). All imports use `.js` extensions.

## Code Patterns

### Adding a New API Endpoint

1. Create service in `/services/[name]Service.js`:
```javascript
class MyService {
  async doSomething() { /* business logic */ }
}
export default new MyService();
```

2. Create route handler in `/routes/[name]Routes.js`:
```javascript
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/response.js';
import myService from '../services/myService.js';

router.get('/', asyncHandler(async (req, res) => {
  const result = await myService.doSomething();
  return successResponse(res, result);
}));
```

3. Register route in `/api/index.js`:
```javascript
import myRoutes from '../routes/myRoutes.js';
v1Router.use('/my-endpoint', myRoutes);
```

### Error Handling
- Wrap async route handlers with `asyncHandler` utility
- Throw errors in services; they'll be caught by global error handler
- Use standard response helpers from `/utils/response.js`

### Response Format
All responses follow a standard format via `successResponse()` and `errorResponse()`:
```javascript
{
  "success": true/false,
  "message": "...",
  "data": {...}  // or "error": {...}
}
```

### Logging
Use the logger utility (`/utils/logger.js`) instead of `console.log`:
```javascript
import { logger } from '../utils/logger.js';
logger.info('message', { meta });
logger.error('error', error);
```

## Dataset Structure

Datasets are stored as JSONL (JSON Lines) in `/ai/datasets/data.jsonl`:
```json
{"id": "papiamentu_001", "input": "Kiko ta empatia?", "output": "Empatia ta compronde e otro hende."}
```

Each line is a complete JSON object. The `datasetService` handles reading and parsing.

## Import Resolution

When updating imports after refactoring:
- Services: `from '../services/[name]Service.js'`
- Utils: `from '../utils/[name].js'`
- Config: `from '../config/index.js'` or `from '../config/constants.js'`
- Middleware: `from '../middleware/[name].js'`

All imports must include `.js` extension (ES Modules requirement).

## Cultural Context

Reflexhon Global focuses on **Papiamentu** cultural alignment. The project aims to preserve and process cultural context in AI interactions. Services should maintain cultural sensitivity and alignment with Papiamentu linguistic patterns.
