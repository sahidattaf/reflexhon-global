import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { HTTP_STATUS } from '../config/constants.js';
import reflexionService from '../services/reflexionService.js';

const router = express.Router();

// POST /api/v1/reflexion/process - Process a reflexion
router.post('/process', asyncHandler(async (req, res) => {
  const { input } = req.body;

  if (!input) {
    return errorResponse(res, 'Input is required', HTTP_STATUS.BAD_REQUEST);
  }

  const result = await reflexionService.processReflexion(input);
  return successResponse(res, result, 'Reflexion processed successfully', HTTP_STATUS.CREATED);
}));

// POST /api/v1/reflexion/alignment - Get cultural alignment
router.post('/alignment', asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return errorResponse(res, 'Text is required', HTTP_STATUS.BAD_REQUEST);
  }

  const result = await reflexionService.getCulturalAlignment(text);
  return successResponse(res, result, 'Cultural alignment retrieved successfully');
}));

export default router;
