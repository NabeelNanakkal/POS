import Printer from '../models/printer.model.js';
import PrintConfig from '../models/printConfig.model.js';
import ApiError from '../utils/ApiError.js';
import { getPaginationParams, buildPagination } from '../utils/pagination.js';

// ── Printers CRUD ─────────────────────────────────────────────────────────────

export const getPrinters = async (storeId, query = {}) => {
  const { page, limit, skip } = getPaginationParams(query);
  const filter = {};
  if (storeId) filter.store = storeId;
  if (query.type) filter.type = query.type;
  if (query.isActive !== undefined) filter.isActive = query.isActive === 'true';

  const [printers, total] = await Promise.all([
    Printer.find(filter).skip(skip).limit(limit).sort({ type: 1, createdAt: -1 }),
    Printer.countDocuments(filter),
  ]);
  return { printers, pagination: buildPagination(page, limit, total) };
};

export const getPrinterById = async (id, storeId) => {
  const filter = { _id: id };
  if (storeId) filter.store = storeId;
  const printer = await Printer.findOne(filter);
  if (!printer) throw ApiError.notFound('Printer not found');
  return printer;
};

export const createPrinter = async (data) => {
  // If set as default, unset other defaults of same type in same store
  if (data.isDefault && data.store) {
    await Printer.updateMany(
      { store: data.store, type: data.type, isDefault: true },
      { $set: { isDefault: false } }
    );
  }
  return Printer.create(data);
};

export const updatePrinter = async (id, data, storeId) => {
  const filter = { _id: id };
  if (storeId) filter.store = storeId;

  const existing = await Printer.findOne(filter);
  if (!existing) throw ApiError.notFound('Printer not found');

  if (data.isDefault) {
    await Printer.updateMany(
      { store: existing.store, type: existing.type, isDefault: true, _id: { $ne: id } },
      { $set: { isDefault: false } }
    );
  }

  const updated = await Printer.findOneAndUpdate(filter, data, { new: true, runValidators: true });
  return updated;
};

export const deletePrinter = async (id, storeId) => {
  const filter = { _id: id };
  if (storeId) filter.store = storeId;
  const printer = await Printer.findOneAndDelete(filter);
  if (!printer) throw ApiError.notFound('Printer not found');
  return printer;
};

// ── Print Config ──────────────────────────────────────────────────────────────

export const getOrCreatePrintConfig = async (storeId) => {
  let config = await PrintConfig.findOne({ store: storeId })
    .populate('defaultReceiptPrinter', 'name type connectionType paperSize')
    .populate('defaultBarcodePrinter', 'name type connectionType paperSize');

  if (!config) {
    config = await PrintConfig.create({ store: storeId });
    config = await PrintConfig.findById(config._id)
      .populate('defaultReceiptPrinter', 'name type connectionType paperSize')
      .populate('defaultBarcodePrinter', 'name type connectionType paperSize');
  }

  return config;
};

export const updatePrintConfig = async (storeId, data) => {
  const config = await PrintConfig.findOneAndUpdate(
    { store: storeId },
    { $set: data },
    { new: true, upsert: true, runValidators: true }
  )
    .populate('defaultReceiptPrinter', 'name type connectionType paperSize')
    .populate('defaultBarcodePrinter', 'name type connectionType paperSize');
  return config;
};
