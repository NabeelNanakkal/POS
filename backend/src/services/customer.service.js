import Customer from '../models/customer.model.js';
import ApiError from '../utils/ApiError.js';
import { getPaginationParams, buildPagination } from '../utils/pagination.js';

export const getCustomers = async (query, storeId) => {
  const { page, limit, skip } = getPaginationParams(query);
  const { search } = query;

  const filter = {};
  if (storeId) filter.store = storeId;
  if (search) {
    const searchRegex = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [
      { name: { $regex: searchRegex, $options: 'i' } },
      { email: { $regex: searchRegex, $options: 'i' } },
      { phone: { $regex: searchRegex, $options: 'i' } },
    ];
  }

  const [customers, total] = await Promise.all([
    Customer.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Customer.countDocuments(filter),
  ]);

  return { customers, pagination: buildPagination(page, limit, total) };
};

export const getCustomerById = async (id, storeId) => {
  const filter = { _id: id };
  if (storeId) filter.store = storeId;
  const customer = await Customer.findOne(filter);
  if (!customer) throw ApiError.notFound('Customer not found');
  return customer;
};

export const createCustomer = async (data, storeId) => {
  const existingCustomer = await Customer.findOne({ phone: data.phone, store: storeId });
  if (existingCustomer) {
    throw ApiError.conflict('Customer with this phone number already exists in this store');
  }
  return Customer.create({ ...data, store: storeId });
};

export const updateCustomer = async (id, data) => {
  const customer = await Customer.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!customer) throw ApiError.notFound('Customer not found');
  return customer;
};

export const deleteCustomer = async (id) => {
  const customer = await Customer.findByIdAndDelete(id);
  if (!customer) throw ApiError.notFound('Customer not found');
  return customer;
};

export const updateLoyaltyPoints = async (id, points) => {
  const customer = await Customer.findByIdAndUpdate(id, { $inc: { loyaltyPoints: points } }, { new: true });
  if (!customer) throw ApiError.notFound('Customer not found');
  return customer;
};

export const updatePurchaseHistory = async (id, purchaseAmount) => {
  if (!purchaseAmount || purchaseAmount <= 0) throw ApiError.badRequest('Valid purchase amount is required');

  const customer = await Customer.findByIdAndUpdate(
    id,
    { lastPurchaseAmount: purchaseAmount, lastPurchaseDate: new Date(), $inc: { totalSpent: purchaseAmount } },
    { new: true, runValidators: true }
  );
  if (!customer) throw ApiError.notFound('Customer not found');
  return customer;
};
