import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as printerService from '../services/printer.service.js';

// ── Printers ──────────────────────────────────────────────────────────────────

export const getPrinters = asyncHandler(async (req, res) => {
  const data = await printerService.getPrinters(req.storeId, req.query);
  res.json(ApiResponse.success(data));
});

export const getPrinterById = asyncHandler(async (req, res) => {
  const printer = await printerService.getPrinterById(req.params.id, req.storeId);
  res.json(ApiResponse.success(printer));
});

export const createPrinter = asyncHandler(async (req, res) => {
  const printer = await printerService.createPrinter({ ...req.body, store: req.storeId });
  res.status(201).json(ApiResponse.created(printer, 'Printer added successfully'));
});

export const updatePrinter = asyncHandler(async (req, res) => {
  const printer = await printerService.updatePrinter(req.params.id, req.body, req.storeId);
  res.json(ApiResponse.success(printer, 'Printer updated successfully'));
});

export const deletePrinter = asyncHandler(async (req, res) => {
  await printerService.deletePrinter(req.params.id, req.storeId);
  res.json(ApiResponse.success(null, 'Printer deleted successfully'));
});

// ── Print Config ──────────────────────────────────────────────────────────────

export const getPrintConfig = asyncHandler(async (req, res) => {
  const config = await printerService.getOrCreatePrintConfig(req.storeId);
  res.json(ApiResponse.success(config));
});

export const updatePrintConfig = asyncHandler(async (req, res) => {
  const config = await printerService.updatePrintConfig(req.storeId, req.body);
  res.json(ApiResponse.success(config, 'Print configuration saved'));
});
