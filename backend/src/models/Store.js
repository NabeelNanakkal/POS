import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Store name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Store code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
    },
    currency: {
      code: {
        type: String,
        trim: true,
      },
      symbol: {
        type: String,
        trim: true,
      },
      name: {
        type: String,
        trim: true,
      },
    },
    status: {
      type: String,
      enum: ['Open', 'Closed', 'Maintenance'],
      default: 'Open'
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Store owner is required'],
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    allowedPaymentModes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PaymentMode'
    }],
  },
  {
    timestamps: true,
  }
);

// Index for faster lookups
storeSchema.index({ code: 1 });
storeSchema.index({ isActive: 1 });
storeSchema.index({ owner: 1 });

const Store = mongoose.model('Store', storeSchema);

export default Store;
