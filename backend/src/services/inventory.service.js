import Inventory from '../models/inventory.model.js';
import Product from '../models/product.model.js';
import ApiError from '../utils/ApiError.js';

export const getInventory = async (query) => {
  const { store, lowStock } = query;
  const filter = {};
  if (store) filter.store = store;

  const inventory = await Inventory.find(filter)
    .populate('product', 'name sku barcode price')
    .populate('store', 'name code')
    .sort({ 'product.name': 1 });

  if (lowStock === 'true') {
    return inventory.filter((item) => item.quantity <= item.reorderPoint);
  }

  return inventory;
};

export const getInventoryById = async (id) => {
  const inventory = await Inventory.findById(id)
    .populate('product', 'name sku barcode price cost')
    .populate('store', 'name code address');
  if (!inventory) throw ApiError.notFound('Inventory record not found');
  return inventory;
};

export const adjustInventory = async (data) => {
  const { product, store, quantity, type } = data;

  if (!['add', 'subtract'].includes(type)) {
    throw ApiError.badRequest('Type must be either "add" or "subtract"');
  }

  let inventory = await Inventory.findOne({ product, store });
  if (!inventory) {
    inventory = await Inventory.create({ product, store, quantity: 0 });
  }

  const adjustment = type === 'add' ? quantity : -quantity;
  inventory.quantity += adjustment;

  if (inventory.quantity < 0) throw ApiError.badRequest('Insufficient inventory to subtract');
  if (type === 'add') inventory.lastRestocked = new Date();

  await inventory.save();
  await Product.findByIdAndUpdate(product, { $inc: { stock: adjustment } });

  return Inventory.findById(inventory._id)
    .populate('product', 'name sku')
    .populate('store', 'name code');
};

export const transferInventory = async (data) => {
  const { product, fromStore, toStore, quantity } = data;

  const sourceInventory = await Inventory.findOne({ product, store: fromStore });
  if (!sourceInventory || sourceInventory.quantity < quantity) {
    throw ApiError.badRequest('Insufficient inventory at source store');
  }

  sourceInventory.quantity -= quantity;
  await sourceInventory.save();

  let destInventory = await Inventory.findOne({ product, store: toStore });
  if (!destInventory) {
    destInventory = await Inventory.create({ product, store: toStore, quantity, lastRestocked: new Date() });
  } else {
    destInventory.quantity += quantity;
    destInventory.lastRestocked = new Date();
    await destInventory.save();
  }

  return { source: sourceInventory, destination: destInventory };
};

export const getLowStockAlerts = async (storeId) => {
  const filter = {};
  if (storeId) filter.store = storeId;

  const inventory = await Inventory.find(filter)
    .populate('product', 'name sku barcode price reorderPoint')
    .populate('store', 'name code');

  return inventory.filter((item) => item.quantity <= item.reorderPoint);
};
