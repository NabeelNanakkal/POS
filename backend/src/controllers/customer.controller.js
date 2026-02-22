import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as customerService from '../services/customer.service.js';

export const getCustomers = asyncHandler(async (req, res) => {
  const storeId = req.storeId || req.user.store;
  const data = await customerService.getCustomers(req.query, storeId);
  res.json(ApiResponse.success(data));
});

export const getCustomerById = asyncHandler(async (req, res) => {
  const storeId = req.storeId || req.user.store;
  const customer = await customerService.getCustomerById(req.params.id, storeId);
  res.json(ApiResponse.success(customer));
});

export const createCustomer = asyncHandler(async (req, res) => {
  const storeId = req.storeId || req.user.store;
  const customer = await customerService.createCustomer(req.body, storeId);
  res.status(201).json(ApiResponse.created(customer, 'Customer created successfully'));
});

export const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.updateCustomer(req.params.id, req.body);
  res.json(ApiResponse.success(customer, 'Customer updated successfully'));
});

export const deleteCustomer = asyncHandler(async (req, res) => {
  await customerService.deleteCustomer(req.params.id);
  res.json(ApiResponse.success(null, 'Customer deleted successfully'));
});

export const updateLoyaltyPoints = asyncHandler(async (req, res) => {
  const customer = await customerService.updateLoyaltyPoints(req.params.id, req.body.points);
  res.json(ApiResponse.success(customer, 'Loyalty points updated successfully'));
});

export const updatePurchaseHistory = asyncHandler(async (req, res) => {
  const customer = await customerService.updatePurchaseHistory(req.params.id, req.body.purchaseAmount);
  res.json(ApiResponse.success(customer, 'Purchase history updated successfully'));
});
