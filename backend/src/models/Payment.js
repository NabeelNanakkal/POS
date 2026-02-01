import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount cannot be negative'],
    },
    method: {
      type: String,
      enum: ['CASH', 'CARD', 'UPI', 'WALLET', 'OTHER'],
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
    },
    transactionId: {
      type: String,
      trim: true,
    },
    cardDetails: {
      last4Digits: String,
      cardType: String, // VISA, MASTERCARD, etc.
    },
    upiDetails: {
      upiId: String,
      transactionRef: String,
    },
    cashReceived: {
      type: Number,
      min: [0, 'Cash received cannot be negative'],
    },
    changeGiven: {
      type: Number,
      default: 0,
      min: [0, 'Change given cannot be negative'],
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster lookups
paymentSchema.index({ order: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ status: 1, createdAt: -1 });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
