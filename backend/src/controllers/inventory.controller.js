import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as inventoryService from '../services/inventory.service.js';

export const getInventory = asyncHandler(async (req, res) => {
  const inventory = await inventoryService.getInventory(req.query);
  res.json(ApiResponse.success(inventory));
});

export const getInventoryById = asyncHandler(async (req, res) => {
  const inventory = await inventoryService.getInventoryById(req.params.id);
  res.json(ApiResponse.success(inventory));
});

export const adjustInventory = asyncHandler(async (req, res) => {
  const inventory = await inventoryService.adjustInventory(req.body);
  res.json(ApiResponse.success(inventory, 'Inventory adjusted successfully'));
});

export const transferInventory = asyncHandler(async (req, res) => {
  const result = await inventoryService.transferInventory(req.body);
  res.json(ApiResponse.success(result, 'Inventory transferred successfully'));
});

export const getLowStockAlerts = asyncHandler(async (req, res) => {
  const alerts = await inventoryService.getLowStockAlerts(req.query.store);
  res.json(ApiResponse.success(alerts));
});
