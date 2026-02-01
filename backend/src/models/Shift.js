import mongoose from 'mongoose';

const shiftSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    status: {
      type: String,
      enum: ['OPEN', 'CLOSED'],
      default: 'OPEN',
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    openingBalance: {
      type: Number,
      required: true,
    },
    closingBalance: {
      type: Number,
    },
    totalSales: {
      type: Number,
      default: 0,
    },
    itemsSold: {
      type: Number,
      default: 0,
    },
    breaks: [
      {
        startTime: { type: Date },
        endTime: { type: Date },
        type: { type: String, enum: ['LUNCH', 'SHORT', 'OTHER'], default: 'OTHER' },
        note: { type: String }
      }
    ],
    notes: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

// Index for performance
shiftSchema.index({ user: 1, status: 1 });
shiftSchema.index({ store: 1, startTime: -1 });

const Shift = mongoose.model('Shift', shiftSchema);

export default Shift;
