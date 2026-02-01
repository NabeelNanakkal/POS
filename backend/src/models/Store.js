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
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster lookups
storeSchema.index({ code: 1 });
storeSchema.index({ isActive: 1 });

const Store = mongoose.model('Store', storeSchema);

export default Store;
