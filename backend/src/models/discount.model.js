import mongoose from 'mongoose';

const discountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Discount name is required'],
      trim: true,
      unique: true,
    },
    code: {
      type: String,
      required: [true, 'Discount code is required'],
      trim: true,
      uppercase: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['PERCENTAGE', 'FIXED_AMOUNT'],
      required: [true, 'Discount type is required'],
    },
    value: {
      type: Number,
      required: [true, 'Discount value is required'],
      min: [0, 'Discount value cannot be negative'],
    },
    applicableTo: {
      type: String,
      enum: ['ALL_PRODUCTS', 'SPECIFIC_PRODUCTS', 'SPECIFIC_CATEGORIES'],
      default: 'ALL_PRODUCTS',
    },
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    }],
    categories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    }],
    minPurchaseAmount: {
      type: Number,
      default: 0,
      min: [0, 'Minimum purchase amount cannot be negative'],
    },
    maxDiscountAmount: {
      type: Number,
      default: null,
      min: [0, 'Maximum discount amount cannot be negative'],
    },
    validFrom: {
      type: Date,
      required: [true, 'Valid from date is required'],
    },
    validTo: {
      type: Date,
      required: [true, 'Valid to date is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usageLimit: {
      type: Number,
      default: null,
      min: [1, 'Usage limit must be at least 1'],
    },
    usageCount: {
      type: Number,
      default: 0,
      min: [0, 'Usage count cannot be negative'],
    },
    totalDiscountAmount: {
      type: Number,
      default: 0,
      min: [0, 'Total discount amount cannot be negative'],
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Validation: percentage discounts should be between 0-100
discountSchema.pre('save', function (next) {
  if (this.type === 'PERCENTAGE' && this.value > 100) {
    next(new Error('Percentage discount cannot exceed 100%'));
  }
  if (this.validTo <= this.validFrom) {
    next(new Error('Valid to date must be after valid from date'));
  }
  next();
});

// Indexes for faster lookups
discountSchema.index({ code: 1 });
discountSchema.index({ store: 1, isActive: 1 });
discountSchema.index({ validFrom: 1, validTo: 1 });

const Discount = mongoose.model('Discount', discountSchema);

export default Discount;
