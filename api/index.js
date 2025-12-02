import express from 'express';
import datasetRoutes from '../routes/datasetRoutes.js';
import reflexionRoutes from '../routes/reflexionRoutes.js';
import { config } from '../config/index.js';

const router = express.Router();

// API version prefix
const v1Router = express.Router();

// Mount routes
v1Router.use('/datasets', datasetRoutes);
v1Router.use('/reflexion', reflexionRoutes);

// Version routing
router.use('/v1', v1Router);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    name: 'Reflexhon Global API',
    version: config.api.version,
    status: 'active',
    endpoints: {
      datasets: '/api/v1/datasets',
      reflexion: '/api/v1/reflexion'
    }
  });
});

export default router;
