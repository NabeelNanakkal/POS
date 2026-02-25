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

// ── Barcode auto-generation ────────────────────────────────────────────────────

const computeEan13Checksum = (raw12) => {
  const digits = raw12.split('').map(Number);
  const sum = digits.reduce((acc, d, i) => acc + d * (i % 2 === 0 ? 1 : 3), 0);
  return (10 - (sum % 10)) % 10;
};

const computeUpcaChecksum = (raw11) => {
  const digits = raw11.split('').map(Number);
  const sum = digits.reduce((acc, d, i) => acc + d * (i % 2 === 0 ? 3 : 1), 0);
  return (10 - (sum % 10)) % 10;
};

export const generateBarcode = async (id, storeId, barcodeType = 'CODE128') => {
  const filter = { _id: id };
  if (storeId) filter.store = storeId;

  const product = await Product.findOne(filter);
  if (!product) throw ApiError.notFound('Product not found');
  if (product.barcode && product.barcode.trim()) return product;

  let barcode;
  let unique = false;
  let attempts = 0;

  while (!unique && attempts < 20) {
    if (barcodeType === 'EAN13') {
      const raw12 =
        String(Math.floor(Math.random() * 99)).padStart(2, '0') +
        String(Date.now()).slice(-7) +
        String(Math.floor(Math.random() * 999)).padStart(3, '0');
      barcode = raw12 + computeEan13Checksum(raw12);
    } else if (barcodeType === 'UPCA') {
      const raw11 = String(Date.now()).slice(-9) + String(Math.floor(Math.random() * 99)).padStart(2, '0');
      barcode = raw11 + computeUpcaChecksum(raw11);
    } else {
      // CODE128 — alphanumeric, always valid
      barcode = `BC${String(Date.now()).slice(-10)}${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
    }

    const exists = await Product.findOne({ barcode });
    if (!exists) unique = true;
    attempts++;
  }

  if (!unique) throw ApiError.internal('Could not generate a unique barcode after 20 attempts');

  product.barcode = barcode;
  await product.save();
  return product;
};

export const generateBarcodesForAllMissing = async (storeId) => {
  const filter = {
    ...(storeId && { store: storeId }),
    $or: [{ barcode: null }, { barcode: { $exists: false } }, { barcode: '' }],
  };
  const products = await Product.find(filter).select('_id barcode');
  const results = [];

  for (const p of products) {
    try {
      const updated = await generateBarcode(p._id, storeId);
      results.push({ id: updated._id, barcode: updated.barcode, success: true });
    } catch {
      results.push({ id: p._id, success: false });
    }
  }

  return {
    generated: results.filter((r) => r.success).length,
    total: products.length,
    results,
  };
};
