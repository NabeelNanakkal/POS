import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get all products with pagination, search, and filters
 * @route   GET /api/products
 * @access  Private
 */
export const getProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, category, isActive, warehouseName } = req.query;

  const query = {};

  // Filter by store (tenant isolation)
  if (req.storeId) {
    query.store = req.storeId;
  }

  // Filter by warehouse
  if (warehouseName) {
    query.warehouseName = warehouseName;
  }

  // Search by name or SKU
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } },
      { barcode: { $regex: search, $options: 'i' } },
    ];
  }

  // Filter by category
  if (category) {
    query.category = category;
  }

  // Filter by active status
  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('category', 'name')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 }),
    Product.countDocuments(query),
  ]);

  res.json(
    ApiResponse.success({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    })
  );
});

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Private
 */
export const getProductById = asyncHandler(async (req, res) => {
  const query = { _id: req.params.id };
  
  // Filter by store
  if (req.storeId) {
    query.store = req.storeId;
  }
  
  const product = await Product.findOne(query).populate('category', 'name description');

  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  res.json(ApiResponse.success(product));
});

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private (Manager, Admin)
 */
export const createProduct = asyncHandler(async (req, res) => {
  if (req.body.reorderPoint === undefined || req.body.reorderPoint === '') {
    req.body.reorderPoint = 50;
  }
  const product = await Product.create(req.body);

  res.status(201).json(ApiResponse.created(product, 'Product created successfully'));
});

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private (Manager, Admin)
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('category', 'name');

  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  res.json(ApiResponse.success(product, 'Product updated successfully'));
});

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private (Admin)
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  res.json(ApiResponse.success(null, 'Product deleted successfully'));
});

/**
 * @desc    Get low stock products
 * @route   GET /api/products/low-stock
 * @access  Private
 */
export const getLowStockProducts = asyncHandler(async (req, res) => {
  const query = {
    $expr: { $lte: ['$stock', '$reorderPoint'] },
    isActive: true,
  };
  
  // Filter by store
  if (req.storeId) {
    query.store = req.storeId;
  }
  
  const products = await Product.find(query).populate('category', 'name');

  res.json(ApiResponse.success(products));
});

/**
 * @desc    Bulk create products
 * @route   POST /api/products/bulk
 * @access  Private (Manager, Admin)
 */
export const bulkCreateProducts = asyncHandler(async (req, res) => {
  const { products } = req.body;

  if (!products || !Array.isArray(products)) {
    throw ApiError.badRequest('Products array is required');
  }

  // Ensure price and cost are set from retailPrice and purchaseRate if missing
  const processedProducts = products.map(p => ({
    ...p,
    price: p.price || p.retailPrice || 0,
    cost: p.cost || p.purchaseRate || 0,
    reorderPoint: p.reorderPoint !== undefined ? p.reorderPoint : 50,
    isActive: p.status === 'Active' || p.isActive !== false
  }));

  const createdProducts = await Product.insertMany(processedProducts);

  res.status(201).json(ApiResponse.created(createdProducts, `${createdProducts.length} products imported successfully`));
});

/**
 * @desc    Get product statistics (Total, Low Stock, Categories, Catalog Value)
 * @route   GET /api/products/stats
 * @access  Private
 */
export const getProductStats = asyncHandler(async (req, res) => {
  const query = {};
  
  // Filter by store
  if (req.storeId) {
    query.store = req.storeId;
  }
  
  const [counts, lowStock, totalCategories, catalogValue] = await Promise.all([
    Product.countDocuments(query),
    Product.countDocuments({ ...query, $expr: { $lte: ['$stock', '$reorderPoint'] }, isActive: true }),
    Product.distinct('category', query),
    Product.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ['$retailPrice', '$stock'] } }
        }
      }
    ])
  ]);

  res.json(
    ApiResponse.success({
      totalProducts: counts,
      lowStockCount: lowStock,
      totalCategories: totalCategories.length,
      catalogValue: catalogValue.length > 0 ? catalogValue[0].totalValue : 0
    })
  );
});
/**
 * @desc    Adjust product stock
 * @route   PUT /api/products/adjust-stock/:id
 * @access  Private (Manager, Admin)
 */
export const adjustStock = asyncHandler(async (req, res) => {
  const { quantity, type, reason } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const qty = parseInt(quantity);
  if (isNaN(qty) || qty <= 0) {
    res.status(400);
    throw new Error('Invalid quantity');
  }

  if (type === 'add') {
    product.stock += qty;
  } else if (type === 'remove') {
    if (product.stock < qty) {
      res.status(400);
      throw new Error('Insufficient stock');
    }
    product.stock -= qty;
  } else {
    res.status(400);
    throw new Error('Invalid adjustment type');
  }

  await product.save();
  res.json(ApiResponse.success(product, `Stock adjusted successfully: ${reason || 'Manual Adjustment'}`));
});
