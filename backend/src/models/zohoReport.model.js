import mongoose from 'mongoose';

const { Schema } = mongoose;

// ── ZohoSale — mirrors Zoho Books invoices ────────────────────────────────────
const zohoSaleSchema = new Schema({
  store:           { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  zohoInvoiceId:   { type: String, required: true },
  invoiceNumber:   { type: String, default: '' },
  referenceNumber: { type: String, default: '' }, // POS order number
  date:            { type: Date },
  customerId:      { type: String, default: '' },
  customerName:    { type: String, default: 'Walk-in Customer' },
  status:          { type: String, default: 'sent' }, // draft|sent|overdue|paid|void|partially_paid
  subTotal:        { type: Number, default: 0 },
  totalTax:        { type: Number, default: 0 },
  discount:        { type: Number, default: 0 },
  total:           { type: Number, default: 0 },
  balance:         { type: Number, default: 0 }, // remaining unpaid amount
  syncedAt:        { type: Date, default: Date.now },
}, { timestamps: false, versionKey: false });

zohoSaleSchema.index({ store: 1, zohoInvoiceId: 1 }, { unique: true });
zohoSaleSchema.index({ store: 1, date: -1 });
zohoSaleSchema.index({ store: 1, status: 1 });

export const ZohoSale = mongoose.model('ZohoSale', zohoSaleSchema);

// ── ZohoPurchase — mirrors Zoho Books bills ───────────────────────────────────
const zohoPurchaseSchema = new Schema({
  store:      { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  zohoBillId: { type: String, required: true },
  billNumber: { type: String, default: '' },
  date:       { type: Date },
  vendorId:   { type: String, default: '' },
  vendorName: { type: String, default: '' },
  status:     { type: String, default: 'open' }, // open|overdue|paid|void|partially_paid
  subTotal:   { type: Number, default: 0 },
  totalTax:   { type: Number, default: 0 },
  total:      { type: Number, default: 0 },
  balance:    { type: Number, default: 0 },
  syncedAt:   { type: Date, default: Date.now },
}, { timestamps: false, versionKey: false });

zohoPurchaseSchema.index({ store: 1, zohoBillId: 1 }, { unique: true });
zohoPurchaseSchema.index({ store: 1, date: -1 });

export const ZohoPurchase = mongoose.model('ZohoPurchase', zohoPurchaseSchema);

// ── ZohoPayment — mirrors Zoho Books customer payments ────────────────────────
const zohoPaymentSchema = new Schema({
  store:         { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  zohoPaymentId: { type: String, required: true },
  date:          { type: Date },
  customerName:  { type: String, default: '' },
  paymentMode:   { type: String, default: 'cash' }, // cash|creditcard|banktransfer|others
  amount:        { type: Number, default: 0 },
  invoiceId:     { type: String, default: '' },
  syncedAt:      { type: Date, default: Date.now },
}, { timestamps: false, versionKey: false });

zohoPaymentSchema.index({ store: 1, zohoPaymentId: 1 }, { unique: true });
zohoPaymentSchema.index({ store: 1, date: -1 });

export const ZohoPayment = mongoose.model('ZohoPayment', zohoPaymentSchema);

// ── ZohoSyncLog — audit trail for sync runs ───────────────────────────────────
const zohoSyncLogSchema = new Schema({
  store:           { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  syncType:        { type: String, enum: ['full', 'incremental'], default: 'incremental' },
  startedAt:       { type: Date, default: Date.now },
  completedAt:     { type: Date },
  status:          { type: String, enum: ['running', 'success', 'failed'], default: 'running' },
  salesSynced:     { type: Number, default: 0 },
  purchasesSynced: { type: Number, default: 0 },
  paymentsSynced:  { type: Number, default: 0 },
  error:           { type: String },
}, { timestamps: false, versionKey: false });

zohoSyncLogSchema.index({ store: 1, startedAt: -1 });

export const ZohoSyncLog = mongoose.model('ZohoSyncLog', zohoSyncLogSchema);
