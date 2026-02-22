import Discount from '../models/discount.model.js';
import ApiError from '../utils/ApiError.js';

export const getDiscounts = async (query, user) => {
  const { isActive, type } = query;

  const filter = {};
  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    filter.store = user.store;
  } else if (user.store) {
    filter.store = user.store;
  }

  if (isActive !== undefined) filter.isActive = isActive === 'true';
  if (type) filter.type = type;

  return Discount.find(filter)
    .populate('products', 'name sku')
    .populate('categories', 'name')
    .sort({ createdAt: -1 });
};

export const getActiveDiscounts = async (user) => {
  const now = new Date();
  const filter = { isActive: true, validFrom: { $lte: now }, validTo: { $gte: now } };

  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    filter.store = user.store;
  } else if (user.store) {
    filter.store = user.store;
  }

  return Discount.find(filter)
    .populate('products', 'name sku')
    .populate('categories', 'name')
    .sort({ createdAt: -1 });
};

export const getDiscountById = async (id, user) => {
  const filter = { _id: id, store: user.store };
  const discount = await Discount.findOne(filter)
    .populate('products', 'name sku price')
    .populate('categories', 'name');
  if (!discount) throw ApiError.notFound('Discount not found');
  return discount;
};

export const createDiscount = async (data, user) => {
  const storeId = user.store || data.store;
  if (!storeId) throw ApiError.badRequest('Store ID is required');
  return Discount.create({ ...data, store: storeId });
};

export const updateDiscount = async (id, data, user) => {
  const filter = { _id: id };
  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') filter.store = user.store;

  const discount = await Discount.findOneAndUpdate(filter, data, { new: true, runValidators: true })
    .populate('products', 'name sku')
    .populate('categories', 'name');

  if (!discount) throw ApiError.notFound('Discount not found');
  return discount;
};

export const deleteDiscount = async (id, user) => {
  const filter = { _id: id };
  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') filter.store = user.store;

  const discount = await Discount.findOneAndDelete(filter);
  if (!discount) throw ApiError.notFound('Discount not found');
  return discount;
};

export const incrementUsageCount = async (id, amount, user) => {
  const filter = { _id: id };
  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') filter.store = user.store;

  const discount = await Discount.findOne(filter);
  if (!discount) throw ApiError.notFound('Discount not found');
  if (discount.usageLimit && discount.usageCount >= discount.usageLimit) {
    throw ApiError.badRequest('Discount usage limit reached');
  }

  discount.usageCount += 1;
  discount.totalDiscountAmount = (discount.totalDiscountAmount || 0) + Number(amount);
  await discount.save();
  return discount;
};
