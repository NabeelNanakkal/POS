import Inventory from '../models/Inventory.js';
import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get inventory for a store
 * @route   GET /api/inventory
 * @access  Private
 */
export const getInventory = asyncHandler(async (req, res) => {
  const { store, lowStock } = req.query;

  const query = {};

  if (store) {
    query.store = store;
  }

  // Filter for low stock items
  if (lowStock === 'true') {
    const inventory = await Inventory.find(query)
      .populate('product', 'name sku barcode price')
      .populate('store', 'name code');

    const lowStockItems = inventory.filter(item => item.quantity <= item.reorderPoint);

    return res.json(ApiResponse.success(lowStockItems));
  }

  const inventory = await Inventory.find(query)
    .populate('product', 'name sku barcode price')
    .populate('store', 'name code')
    .sort({ 'product.name': 1 });

  res.json(ApiResponse.success(inventory));
});

/**
 * @desc    Get inventory by ID
 * @route   GET /api/inventory/:id
 * @access  Private
 */
export const getInventoryById = asyncHandler(async (req, res) => {
  const inventory = await Inventory.findById(req.params.id)
    .populate('product', 'name sku barcode price cost')
    .populate('store', 'name code address');

  if (!inventory) {
    throw ApiError.notFound('Inventory record not found');
  }

  res.json(ApiResponse.success(inventory));
});

/**
 * @desc    Adjust inventory stock
 * @route   POST /api/inventory/adjust
 * @access  Private (Inventory Manager, Manager, Admin)
 */
export const adjustInventory = asyncHandler(async (req, res) => {
  const { product, store, quantity, type } = req.body; // type: 'add' or 'subtract'

  if (!['add', 'subtract'].includes(type)) {
    throw ApiError.badRequest('Type must be either "add" or "subtract"');
  }

  // Find or create inventory record
  let inventory = await Inventory.findOne({ product, store });

  if (!inventory) {
    inventory = await Inventory.create({
      product,
      store,
      quantity: 0,
    });
  }

  // Adjust quantity
  const adjustment = type === 'add' ? quantity : -quantity;
  inventory.quantity += adjustment;

  if (inventory.quantity < 0) {
    throw ApiError.badRequest('Insufficient inventory to subtract');
  }

  if (type === 'add') {
    inventory.lastRestocked = new Date();
  }

  await inventory.save();

  // Also update product stock
  await Product.findByIdAndUpdate(product, {
    $inc: { stock: adjustment },
  });

  const populatedInventory = await Inventory.findById(inventory._id)
    .populate('product', 'name sku')
    .populate('store', 'name code');

  res.json(ApiResponse.success(populatedInventory, 'Inventory adjusted successfully'));
});

/**
 * @desc    Transfer inventory between stores
 * @route   POST /api/inventory/transfer
 * @access  Private (Inventory Manager, Manager, Admin)
 */
export const transferInventory = asyncHandler(async (req, res) => {
  const { product, fromStore, toStore, quantity } = req.body;

  // Check source inventory
  const sourceInventory = await Inventory.findOne({ product, store: fromStore });

  if (!sourceInventory || sourceInventory.quantity < quantity) {
    throw ApiError.badRequest('Insufficient inventory at source store');
  }

  // Deduct from source
  sourceInventory.quantity -= quantity;
  await sourceInventory.save();

  // Add to destination
  let destInventory = await Inventory.findOne({ product, store: toStore });

  if (!destInventory) {
    destInventory = await Inventory.create({
      product,
      store: toStore,
      quantity,
      lastRestocked: new Date(),
    });
  } else {
    destInventory.quantity += quantity;
    destInventory.lastRestocked = new Date();
    await destInventory.save();
  }

  res.json(
    ApiResponse.success(
      {
        source: sourceInventory,
        destination: destInventory,
      },
      'Inventory transferred successfully'
    )
  );
});

/**
 * @desc    Get low stock alerts
 * @route   GET /api/inventory/alerts
 * @access  Private
 */
export const getLowStockAlerts = asyncHandler(async (req, res) => {
  const { store } = req.query;

  const query = {};
  if (store) {
    query.store = store;
  }

  const inventory = await Inventory.find(query)
    .populate('product', 'name sku barcode price reorderPoint')
    .populate('store', 'name code');

  const alerts = inventory.filter(item => item.quantity <= item.reorderPoint);

  res.json(ApiResponse.success(alerts));
});
