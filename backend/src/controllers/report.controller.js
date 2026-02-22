import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as reportService from '../services/report.service.js';

export const getSalesReport = asyncHandler(async (req, res) => {
  const data = await reportService.getSalesReport(req.query);
  res.json(ApiResponse.success(data));
});
