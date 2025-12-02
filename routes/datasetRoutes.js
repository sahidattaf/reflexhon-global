import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { HTTP_STATUS } from '../config/constants.js';
import datasetService from '../services/datasetService.js';

const router = express.Router();

// GET /api/v1/datasets - Get all dataset entries
router.get('/', asyncHandler(async (req, res) => {
  const data = await datasetService.getAllData();
  return successResponse(res, data, 'Dataset retrieved successfully');
}));

// GET /api/v1/datasets/:id - Get dataset entry by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await datasetService.getDataById(id);

  if (!data) {
    return errorResponse(res, 'Data not found', HTTP_STATUS.NOT_FOUND);
  }

  return successResponse(res, data, 'Data retrieved successfully');
}));

// GET /api/v1/datasets/search?q=query - Search dataset
router.get('/search', asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return errorResponse(res, 'Search query is required', HTTP_STATUS.BAD_REQUEST);
  }

  const results = await datasetService.searchData(q);
  return successResponse(res, results, 'Search completed successfully');
}));

export default router;
