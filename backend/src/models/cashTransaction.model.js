import mongoose from 'mongoose';

const cashTransactionSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CashSession',
      required: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    type: {
      type: String,
      enum: ['SALE', 'REFUND', 'CASH_IN', 'CASH_OUT'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount cannot be negative'],
    },
    // e.g. order number for SALE/REFUND
    reference: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

cashTransactionSchema.index({ session: 1 });
cashTransactionSchema.index({ session: 1, type: 1 });
cashTransactionSchema.index({ store: 1, createdAt: -1 });

const CashTransaction = mongoose.model('CashTransaction', cashTransactionSchema);
export default CashTransaction;
