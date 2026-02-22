import Category from '../models/category.model.js';
import ApiError from '../utils/ApiError.js';

export const getCategories = async (storeId) => {
  const filter = {};
  if (storeId) filter.store = storeId;
  return Category.find(filter).populate('parent', 'name').sort({ name: 1 });
};

export const getCategoryById = async (id, storeId) => {
  const filter = { _id: id };
  if (storeId) filter.store = storeId;
  const category = await Category.findOne(filter).populate('parent', 'name description');
  if (!category) throw ApiError.notFound('Category not found');
  return category;
};

export const createCategory = async (data) => {
  return Category.create(data);
};

export const updateCategory = async (id, data) => {
  const category = await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('parent', 'name');
  if (!category) throw ApiError.notFound('Category not found');
  return category;
};

export const deleteCategory = async (id) => {
  const category = await Category.findByIdAndDelete(id);
  if (!category) throw ApiError.notFound('Category not found');
  return category;
};
