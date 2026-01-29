import mongoose from 'mongoose';

const shiftSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  startTime: {
    type: Date,
    default: Date.now,
    required: true
  },
  endTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['OPEN', 'CLOSED'],
    default: 'OPEN'
  },
  openingBalance: {
    type: Number,
    required: true,
    min: 0
  },
  closingBalance: { // System calculated closing balance
    type: Number,
    default: 0
  },
  actualClosingBalance: { // Actual entered by cashier
    type: Number
  },
  cashMetrics: {
    expectedCash: { type: Number, default: 0 },
    actualCash: { type: Number, default: 0 },
    difference: { type: Number, default: 0 }
  },
  paymentSummary: {
    cash: { type: Number, default: 0 },
    card: { type: Number, default: 0 },
    upi: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  cashMovements: [{
    type: { type: String, enum: ['IN', 'OUT'], required: true },
    amount: { type: Number, required: true },
    reason: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],
  notes: String
}, {
  timestamps: true
});

// Ensure a user can only have one open shift at a time
shiftSchema.index({ userId: 1, status: 1 }, { unique: true, partialFilterExpression: { status: 'OPEN' } });

export default mongoose.model('Shift', shiftSchema);
