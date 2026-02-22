import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as productService from '../services/product.service.js';

export const getProducts = asyncHandler(async (req, res) => {
  const data = await productService.getProducts(req.query, req.storeId);
  res.json(ApiResponse.success(data));
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id, req.storeId);
  res.json(ApiResponse.success(product));
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json(ApiResponse.created(product, 'Product created successfully'));
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  res.json(ApiResponse.success(product, 'Product updated successfully'));
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  res.json(ApiResponse.success(null, 'Product deleted successfully'));
});

export const getLowStockProducts = asyncHandler(async (req, res) => {
  const products = await productService.getLowStockProducts(req.storeId);
  res.json(ApiResponse.success(products));
});

export const getProductStats = asyncHandler(async (req, res) => {
  const stats = await productService.getProductStats(req.storeId);
  res.json(ApiResponse.success(stats));
});

export const adjustStock = asyncHandler(async (req, res) => {
  const { quantity, type, reason } = req.body;
  const product = await productService.adjustStock(req.params.id, quantity, type, reason);
  res.json(ApiResponse.success(product, `Stock adjusted successfully: ${reason || 'Manual Adjustment'}`));
});

export const bulkCreateProducts = asyncHandler(async (req, res) => {
  const products = await productService.bulkCreateProducts(req.body.products);
  res.status(201).json(ApiResponse.created(products, `${products.length} products imported successfully`));
});
