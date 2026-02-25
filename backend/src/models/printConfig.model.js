import mongoose from 'mongoose';

const stickerTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Default Template' },
    width: { type: Number, default: 50 },
    height: { type: Number, default: 25 },
    showProductName: { type: Boolean, default: true },
    showBarcode: { type: Boolean, default: true },
    showPrice: { type: Boolean, default: true },
    showSku: { type: Boolean, default: false },
    showExpiry: { type: Boolean, default: false },
    fontSize: { type: Number, default: 10 },
    barcodeHeight: { type: Number, default: 40 },
  },
  { _id: false }
);

const printConfigSchema = new mongoose.Schema(
  {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
      unique: true,
    },
    defaultReceiptPrinter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Printer',
      default: null,
    },
    defaultBarcodePrinter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Printer',
      default: null,
    },
    autoPrintAfterSale: { type: Boolean, default: false },
    printBarcodeOnCreate: { type: Boolean, default: false },
    defaultBarcodeType: {
      type: String,
      enum: ['CODE128', 'EAN13', 'UPCA', 'QR'],
      default: 'CODE128',
    },
    stickerTemplates: {
      type: [stickerTemplateSchema],
      default: [
        {
          name: '40x30mm Label',
          width: 40, height: 30,
          showProductName: true, showBarcode: true, showPrice: true,
          showSku: false, showExpiry: false, fontSize: 10, barcodeHeight: 38,
        },
        {
          name: '50x25mm Label',
          width: 50, height: 25,
          showProductName: true, showBarcode: true, showPrice: false,
          showSku: false, showExpiry: false, fontSize: 9, barcodeHeight: 32,
        },
        {
          name: 'Custom (60x40mm)',
          width: 60, height: 40,
          showProductName: true, showBarcode: true, showPrice: true,
          showSku: true, showExpiry: false, fontSize: 11, barcodeHeight: 48,
        },
      ],
    },
    receiptHeader: { type: String, default: '' },
    receiptFooter: { type: String, default: 'Thank you for your purchase!' },
    showLogoOnReceipt: { type: Boolean, default: true },
    showTaxOnReceipt: { type: Boolean, default: true },
    showCashierOnReceipt: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const PrintConfig = mongoose.model('PrintConfig', printConfigSchema);
export default PrintConfig;
