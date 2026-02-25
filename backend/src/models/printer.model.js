import mongoose from 'mongoose';

const printerSchema = new mongoose.Schema(
  {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Printer name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['RECEIPT', 'BARCODE', 'KITCHEN'],
      required: true,
      default: 'RECEIPT',
    },
    connectionType: {
      type: String,
      enum: ['USB', 'NETWORK', 'BLUETOOTH'],
      default: 'USB',
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    port: {
      type: Number,
      default: 9100,
    },
    paperSize: {
      type: String,
      enum: ['58mm', '80mm', 'A4', 'CUSTOM'],
      default: '80mm',
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

printerSchema.index({ store: 1 });
printerSchema.index({ store: 1, type: 1 });
printerSchema.index({ store: 1, type: 1, isDefault: 1 });

const Printer = mongoose.model('Printer', printerSchema);
export default Printer;
