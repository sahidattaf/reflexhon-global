# Reflexhon Global - Cloud API Architecture

## Project Structure

```
reflexhon-global/
├── api/                    # API endpoint definitions and versioning
│   └── index.js           # Main API router with version routing
├── routes/                 # Route handlers
│   ├── datasetRoutes.js   # Dataset management routes
│   └── reflexionRoutes.js # Reflexion processing routes
├── services/              # Business logic layer
│   ├── datasetService.js  # Dataset operations
│   └── reflexionService.js # Reflexion processing logic
├── utils/                  # Utility functions
│   ├── asyncHandler.js    # Async error handling wrapper
│   ├── logger.js          # Logging utility
│   └── response.js        # Standardized response helpers
├── middleware/            # Express middleware
│   ├── errorHandler.js    # Global error handler
│   ├── notFound.js        # 404 handler
│   └── validateRequest.js # Request validation
├── config/                # Configuration files
│   ├── index.js          # Main config
│   └── constants.js      # App constants
├── ai/                    # AI models and datasets
│   ├── datasets/
│   └── models/
├── docs/                  # Documentation
│   ├── API.md
│   ├── ARCHITECTURE.md
│   └── guides/
├── huggingface/          # HuggingFace integration
│   ├── datasets/
│   └── models/
├── server.js             # Application entry point
├── package.json          # Dependencies and scripts
└── .env.example          # Environment variables template
```

## Architecture Layers

### 1. Entry Point (`server.js`)
- Initializes Express app
- Configures middleware (security, logging, parsing)
- Mounts API routes
- Sets up error handling

### 2. API Layer (`/api`)
- Defines API versioning (v1, v2, etc.)
- Routes requests to appropriate route handlers
- Provides API discovery endpoint

### 3. Routes Layer (`/routes`)
- Handles HTTP requests/responses
- Validates input parameters
- Calls service layer for business logic
- Returns standardized responses

### 4. Services Layer (`/services`)
- Contains business logic
- Interacts with data sources (datasets, databases, external APIs)
- Independent of HTTP layer (can be used in other contexts)
- Handles data transformation and processing

### 5. Utilities (`/utils`)
- **asyncHandler**: Wraps async route handlers for error handling
- **logger**: Centralized logging utility
- **response**: Standardized success/error response helpers

### 6. Middleware (`/middleware`)
- **errorHandler**: Global error handling
- **notFound**: 404 handling for undefined routes
- **validateRequest**: Request validation middleware

### 7. Configuration (`/config`)
- Environment-based configuration
- Application constants
- Centralized settings management

## Request Flow

```
Client Request
    ↓
server.js (Express app)
    ↓
Middleware (helmet, cors, morgan, etc.)
    ↓
API Router (/api/index.js)
    ↓
Version Router (/api/v1)
    ↓
Route Handler (/routes/*.js)
    ↓
Service Layer (/services/*.js)
    ↓
Data Source (datasets, DB, external API)
    ↓
Response (via utils/response.js)
    ↓
Client
```

## Design Principles

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **Modularity**: Components are independent and reusable
3. **Scalability**: Easy to add new routes, services, and versions
4. **Maintainability**: Clear structure makes code easy to navigate
5. **Error Handling**: Centralized error handling with async support
6. **Standardization**: Consistent response format across all endpoints

## Adding New Features

### To add a new API endpoint:

1. **Create a service** in `/services/` with business logic
2. **Create a route handler** in `/routes/` that uses the service
3. **Register the route** in `/api/index.js`
4. **Update documentation** in `/docs/API.md`

Example:
```javascript
// 1. Create service: /services/myService.js
class MyService {
  async doSomething() { /* logic */ }
}
export default new MyService();

// 2. Create route: /routes/myRoutes.js
import myService from '../services/myService.js';
router.get('/', asyncHandler(async (req, res) => {
  const result = await myService.doSomething();
  return successResponse(res, result);
}));

// 3. Register in /api/index.js
import myRoutes from '../routes/myRoutes.js';
v1Router.use('/my-endpoint', myRoutes);
```

## Environment Configuration

Copy `.env.example` to `.env` and configure:
- `NODE_ENV`: development | production
- `PORT`: Server port (default: 3000)
- `API_VERSION`: API version (default: v1)

## Future Enhancements

- Database integration (MongoDB, PostgreSQL)
- Authentication & authorization (JWT)
- Rate limiting
- Caching layer (Redis)
- WebSocket support for real-time features
- API documentation with Swagger/OpenAPI
- Unit and integration tests
- CI/CD pipeline
