import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as categoryService from '../services/category.service.js';

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getCategories(req.storeId);
  res.json(ApiResponse.success(categories));
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id, req.storeId);
  res.json(ApiResponse.success(category));
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  res.status(201).json(ApiResponse.created(category, 'Category created successfully'));
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  res.json(ApiResponse.success(category, 'Category updated successfully'));
});

export const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  res.json(ApiResponse.success(null, 'Category deleted successfully'));
});
