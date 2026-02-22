import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as discountService from '../services/discount.service.js';

export const getDiscounts = asyncHandler(async (req, res) => {
  const discounts = await discountService.getDiscounts(req.query, req.user);
  res.json(ApiResponse.success(discounts));
});

export const getActiveDiscounts = asyncHandler(async (req, res) => {
  const discounts = await discountService.getActiveDiscounts(req.user);
  res.json(ApiResponse.success(discounts));
});

export const getDiscountById = asyncHandler(async (req, res) => {
  const discount = await discountService.getDiscountById(req.params.id, req.user);
  res.json(ApiResponse.success(discount));
});

export const createDiscount = asyncHandler(async (req, res) => {
  const discount = await discountService.createDiscount(req.body, req.user);
  res.status(201).json(ApiResponse.created(discount, 'Discount created successfully'));
});

export const updateDiscount = asyncHandler(async (req, res) => {
  const discount = await discountService.updateDiscount(req.params.id, req.body, req.user);
  res.json(ApiResponse.success(discount, 'Discount updated successfully'));
});

export const deleteDiscount = asyncHandler(async (req, res) => {
  await discountService.deleteDiscount(req.params.id, req.user);
  res.json(ApiResponse.success(null, 'Discount deleted successfully'));
});

export const incrementUsageCount = asyncHandler(async (req, res) => {
  const discount = await discountService.incrementUsageCount(req.params.id, req.body.amount || 0, req.user);
  res.json(ApiResponse.success(discount, 'Discount usage updated successfully'));
});
