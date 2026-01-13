/**
 * Analytics Routes
 *
 * API endpoints for analytics dashboard
 */

import express from 'express';
import AnalyticsService from '../services/analytics/AnalyticsService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/response.js';

const router = express.Router();

/**
 * GET /api/v1/analytics
 * Get analytics summary
 */
router.get('/', asyncHandler(async (req, res) => {
  const timeRange = parseInt(req.query.range) || 24; // Default: last 24 hours

  const analytics = AnalyticsService.getAnalytics(timeRange);

  return successResponse(res, analytics, 'Analytics retrieved successfully');
}));

/**
 * GET /api/v1/analytics/realtime
 * Get real-time statistics
 */
router.get('/realtime', asyncHandler(async (req, res) => {
  const realtimeStats = AnalyticsService.getRealTimeStats();

  return successResponse(res, realtimeStats, 'Real-time stats retrieved');
}));

/**
 * GET /api/v1/analytics/export
 * Export all analytics data
 */
router.get('/export', asyncHandler(async (req, res) => {
  const exportData = AnalyticsService.exportData();

  return successResponse(res, exportData, 'Analytics data exported');
}));

/**
 * POST /api/v1/analytics/track
 * Manually track an event (for testing)
 */
router.post('/track', asyncHandler(async (req, res) => {
  const { path, method, status, responseTime } = req.body;

  AnalyticsService.trackRequest({
    path: path || req.path,
    method: method || req.method,
    status: status || 200,
    responseTime: responseTime || 0,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  return successResponse(res, { tracked: true }, 'Event tracked successfully');
}));

export default router;
