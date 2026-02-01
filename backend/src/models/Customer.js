import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    loyaltyPoints: {
      type: Number,
      default: 0,
      min: [0, 'Loyalty points cannot be negative'],
    },
    totalSpent: {
      type: Number,
      default: 0,
      min: [0, 'Total spent cannot be negative'],
    },
    lastVisit: {
      type: Date,
      default: null,
    },
    lastPurchaseAmount: {
      type: Number,
      default: 0
    },
    lastPurchaseDate: {
      type: Date,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true
    }
  },
  {
    timestamps: true,
  }
);

// Index for faster lookups
customerSchema.index({ phone: 1, store: 1 }, { unique: true }); // Phone unique per store
customerSchema.index({ email: 1, store: 1 });
customerSchema.index({ name: 'text' });
customerSchema.index({ store: 1 });

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
