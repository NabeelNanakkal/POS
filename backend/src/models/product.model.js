import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      uppercase: true,
      trim: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: [true, 'Store is required'],
    },
    barcode: {
      type: String,
      unique: true,
      sparse: true, // Allow null values
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    retailPrice: { // Alias/mapping for UI
      type: Number,
      min: [0, 'Price cannot be negative'],
    },
    cost: {
      type: Number,
      required: [true, 'Cost is required'],
      min: [0, 'Cost cannot be negative'],
    },
    purchaseRate: { // Alias/mapping for UI
      type: Number,
      min: [0, 'Cost cannot be negative'],
    },
    productType: {
      type: String,
      default: 'Goods',
    },
    usageUnit: {
      type: String,
      default: 'pcs',
    },
    purchaseDescription: {
      type: String,
      trim: true,
    },
    itemType: {
      type: String,
      default: 'Inventory',
    },
    purchaseAccount: {
      type: String,
      default: 'Cost of Goods Sold',
    },
    inventoryAccount: {
      type: String,
      default: 'Inventory Asset',
    },
    vendor: {
      type: String,
      trim: true,
    },
    warehouseName: {
      type: String,
      default: 'Main Warehouse',
    },
    taxName: {
      type: String,
      default: 'None',
    },
    taxType: {
      type: String,
      default: 'Percentage',
    },
    exemptionReason: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    reorderPoint: {
      type: Number,
      default: 10,
      min: [0, 'Reorder point cannot be negative'],
    },
    committed: {
      type: Number,
      default: 0,
      min: [0, 'Committed stock cannot be negative'],
    },
    images: [{
      type: String,
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
    taxRate: {
      type: Number,
      default: 0,
      min: [0, 'Tax rate cannot be negative'],
      max: [100, 'Tax rate cannot exceed 100%'],
    },
    taxPercentage: { // Alias for UI
      type: Number,
      default: 0,
    },
    zohoItemId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for profit margin
productSchema.virtual('profitMargin').get(function () {
  if (this.cost === 0) return 0;
  return ((this.price - this.cost) / this.cost) * 100;
});

// Indexes for faster lookups
productSchema.index({ sku: 1, store: 1 }, { unique: true }); // SKU unique per store
productSchema.index({ barcode: 1 });
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ store: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
