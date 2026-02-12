import mongoose from 'mongoose';

const paymentModeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true
    },
    value: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    icon: {
      type: String,
      default: '💵' 
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes for faster lookups
paymentModeSchema.index({ name: 1, store: 1 }, { unique: true });
paymentModeSchema.index({ value: 1, store: 1 }, { unique: true });
paymentModeSchema.index({ store: 1 });

const PaymentMode = mongoose.model('PaymentMode', paymentModeSchema);

export default PaymentMode;
