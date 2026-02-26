import mongoose from 'mongoose';

const { Schema } = mongoose;

const dailySummarySchema = new Schema(
  {
    store:        { type: Schema.Types.ObjectId, ref: 'Store', required: true },
    date:         { type: String, required: true },  // 'YYYY-MM-DD'
    totalSales:   { type: Number, default: 0 },
    totalOrders:  { type: Number, default: 0 },
    cashSales:    { type: Number, default: 0 },
    digitalSales: { type: Number, default: 0 },     // card + UPI + wallet etc.
    refundAmount: { type: Number, default: 0 },
    refundCount:  { type: Number, default: 0 },
    totalPurchase:{ type: Number, default: 0 },
    totalExpense: { type: Number, default: 0 },     // CASH_OUT transactions
    netProfit:    { type: Number, default: 0 },     // sales - refunds - purchase - expense
    paymentBreakdown: [
      {
        method: { type: String },
        amount: { type: Number, default: 0 },
      },
    ],
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

dailySummarySchema.index({ store: 1, date: 1 }, { unique: true });

export default mongoose.model('DailySummary', dailySummarySchema);
