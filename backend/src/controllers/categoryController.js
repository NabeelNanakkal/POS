import Category from '../models/Category.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Private
 */
export const getCategories = asyncHandler(async (req, res) => {
  const query = {};
  
  // Filter by store
  if (req.storeId) {
    query.store = req.storeId;
  }
  
  const categories = await Category.find(query).populate('parent', 'name').sort({ name: 1 });

  res.json(ApiResponse.success(categories));
});

/**
 * @desc    Get category by ID
 * @route   GET /api/categories/:id
 * @access  Private
 */
export const getCategoryById = asyncHandler(async (req, res) => {
  const query = { _id: req.params.id };
  
  // Filter by store
  if (req.storeId) {
    query.store = req.storeId;
  }
  
  const category = await Category.findOne(query).populate('parent', 'name description');

  if (!category) {
    throw ApiError.notFound('Category not found');
  }

  res.json(ApiResponse.success(category));
});

/**
 * @desc    Create new category
 * @route   POST /api/categories
 * @access  Private (Manager, Admin)
 */
export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);

  res.status(201).json(ApiResponse.created(category, 'Category created successfully'));
});

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private (Manager, Admin)
 */
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('parent', 'name');

  if (!category) {
    throw ApiError.notFound('Category not found');
  }

  res.json(ApiResponse.success(category, 'Category updated successfully'));
});

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private (Admin)
 */
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    throw ApiError.notFound('Category not found');
  }

  res.json(ApiResponse.success(null, 'Category deleted successfully'));
});
