import mongoose from 'mongoose';

const cashSessionSchema = new mongoose.Schema(
  {
    date: {
      type: String, // 'YYYY-MM-DD'
      required: true,
    },
    counter: {
      type: String,
      default: 'MAIN',
      trim: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    openedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    closedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    openingBalance: {
      type: Number,
      required: true,
      min: [0, 'Opening balance cannot be negative'],
    },
    // Running total: openingBalance + SALES + CASH_IN - REFUNDS - CASH_OUT
    expectedBalance: {
      type: Number,
      default: 0,
    },
    // Actual physical cash entered at close
    closingBalance: {
      type: Number,
      default: null,
    },
    // closingBalance - expectedBalance (positive = excess, negative = shortage)
    difference: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ['OPEN', 'CLOSED'],
      default: 'OPEN',
    },
    openedAt: {
      type: Date,
      default: Date.now,
    },
    closedAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// One session per store + counter + date
cashSessionSchema.index({ store: 1, counter: 1, date: 1 }, { unique: true });
cashSessionSchema.index({ store: 1, status: 1 });
cashSessionSchema.index({ store: 1, date: -1 });

const CashSession = mongoose.model('CashSession', cashSessionSchema);
export default CashSession;
