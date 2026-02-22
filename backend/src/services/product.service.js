import Product from '../models/product.model.js';
import ApiError from '../utils/ApiError.js';
import { getPaginationParams, buildPagination } from '../utils/pagination.js';

export const getProducts = async (query, storeId) => {
  const { page, limit, skip } = getPaginationParams(query);
  const { search, category, isActive, warehouseName } = query;

  const filter = {};
  if (storeId) filter.store = storeId;
  if (warehouseName) filter.warehouseName = warehouseName;
  if (category) filter.category = category;
  if (isActive !== undefined) filter.isActive = isActive === 'true';
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } },
      { barcode: { $regex: search, $options: 'i' } },
    ];
  }

  const [products, total] = await Promise.all([
    Product.find(filter).populate('category', 'name').skip(skip).limit(limit).sort({ createdAt: -1 }),
    Product.countDocuments(filter),
  ]);

  return { products, pagination: buildPagination(page, limit, total) };
};

export const getProductById = async (id, storeId) => {
  const filter = { _id: id };
  if (storeId) filter.store = storeId;
  const product = await Product.findOne(filter).populate('category', 'name description');
  if (!product) throw ApiError.notFound('Product not found');
  return product;
};

export const createProduct = async (data) => {
  if (data.reorderPoint === undefined || data.reorderPoint === '') {
    data.reorderPoint = 50;
  }
  return Product.create(data);
};

export const updateProduct = async (id, data) => {
  const product = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('category', 'name');
  if (!product) throw ApiError.notFound('Product not found');
  return product;
};

export const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw ApiError.notFound('Product not found');
  return product;
};

export const getLowStockProducts = async (storeId) => {
  const filter = { $expr: { $lte: ['$stock', '$reorderPoint'] }, isActive: true };
  if (storeId) filter.store = storeId;
  return Product.find(filter).populate('category', 'name');
};

export const getProductStats = async (storeId) => {
  const filter = {};
  if (storeId) filter.store = storeId;

  const [counts, lowStock, totalCategories, catalogValue] = await Promise.all([
    Product.countDocuments(filter),
    Product.countDocuments({ ...filter, $expr: { $lte: ['$stock', '$reorderPoint'] }, isActive: true }),
    Product.distinct('category', filter),
    Product.aggregate([
      { $match: filter },
      { $group: { _id: null, totalValue: { $sum: { $multiply: ['$retailPrice', '$stock'] } } } },
    ]),
  ]);

  return {
    totalProducts: counts,
    lowStockCount: lowStock,
    totalCategories: totalCategories.length,
    catalogValue: catalogValue.length > 0 ? catalogValue[0].totalValue : 0,
  };
};

export const adjustStock = async (id, quantity, type, reason) => {
  const product = await Product.findById(id);
  if (!product) throw ApiError.notFound('Product not found');

  const qty = parseInt(quantity);
  if (isNaN(qty) || qty <= 0) throw ApiError.badRequest('Invalid quantity');

  if (type === 'add') {
    product.stock += qty;
  } else if (type === 'remove') {
    if (product.stock < qty) throw ApiError.badRequest('Insufficient stock');
    product.stock -= qty;
  } else {
    throw ApiError.badRequest('Invalid adjustment type. Use "add" or "remove"');
  }

  await product.save();
  return product;
};

export const bulkCreateProducts = async (products) => {
  if (!products || !Array.isArray(products)) throw ApiError.badRequest('Products array is required');

  const processedProducts = products.map((p) => ({
    ...p,
    price: p.price || p.retailPrice || 0,
    cost: p.cost || p.purchaseRate || 0,
    reorderPoint: p.reorderPoint !== undefined ? p.reorderPoint : 50,
    isActive: p.status === 'Active' || p.isActive !== false,
  }));

  return Product.insertMany(processedProducts);
};
