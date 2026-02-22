import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as storeService from '../services/store.service.js';

export const getStores = asyncHandler(async (req, res) => {
  const data = await storeService.getStores(req.query, { ...req.user.toObject(), storeId: req.storeId });
  res.json(ApiResponse.success(data));
});

export const getStoreById = asyncHandler(async (req, res) => {
  const store = await storeService.getStoreById(req.params.id, req.user);
  res.json(ApiResponse.success(store));
});

export const createStore = asyncHandler(async (req, res) => {
  const store = await storeService.createStore(req.body, req.user._id);
  res.status(201).json(ApiResponse.created(store, 'Store created successfully'));
});

export const updateStore = asyncHandler(async (req, res) => {
  const store = await storeService.updateStore(req.params.id, req.body, req.user);
  res.json(ApiResponse.success(store, 'Store updated successfully'));
});

export const deleteStore = asyncHandler(async (req, res) => {
  await storeService.deleteStore(req.params.id, req.user);
  res.json(ApiResponse.success(null, 'Store deleted successfully'));
});

export const toggleStoreStatus = asyncHandler(async (req, res) => {
  const store = await storeService.toggleStoreStatus(req.params.id, req.body.isActive, req.user);
  res.json(ApiResponse.success(store, 'Store status updated successfully'));
});

export const bulkCreateStores = asyncHandler(async (req, res) => {
  const storesData = Array.isArray(req.body) ? req.body : [req.body];
  const stores = await storeService.bulkCreateStores(storesData, req.user._id);
  res.status(201).json(ApiResponse.created(stores, `${stores.length} stores imported successfully`));
});
