import Shift from '../models/shift.model.js';
import ApiError from '../utils/ApiError.js';
import { getPaginationParams, buildPagination } from '../utils/pagination.js';

export const openShift = async (userId, storeId, data) => {
  const { openingBalance, notes } = data;

  if (openingBalance === undefined || openingBalance === null) {
    throw ApiError.badRequest('Opening balance is required');
  }

  const existingShift = await Shift.findOne({ user: userId, status: 'OPEN' });
  if (existingShift) {
    throw ApiError.conflict('You already have an open shift. Please close it before opening a new one.');
  }

  return Shift.create({ user: userId, store: storeId, openingBalance, notes, status: 'OPEN', startTime: new Date() });
};

export const closeShift = async (userId, data) => {
  const { closingBalance, notes, totalSales, itemsSold } = data;

  const shift = await Shift.findOne({ user: userId, status: 'OPEN' });
  if (!shift) throw ApiError.notFound('No open shift found for this user');

  shift.status = 'CLOSED';
  shift.endTime = new Date();
  shift.closingBalance = closingBalance !== undefined ? closingBalance : shift.openingBalance + shift.totalSales;
  if (totalSales !== undefined) shift.totalSales = totalSales;
  if (itemsSold !== undefined) shift.itemsSold = itemsSold;
  if (notes) shift.notes = (shift.notes ? shift.notes + '\n' : '') + notes;

  await shift.save();
  return shift;
};

export const getCurrentShift = async (userId) => {
  return Shift.findOne({ user: userId, status: 'OPEN' });
};

export const getStoreShifts = async (query, user) => {
  const { page, limit, skip } = getPaginationParams(query);
  const { storeId, search = '', status = 'ALL', startDate, endDate, sortBy = 'startTime', sortOrder = 'desc' } = query;

  const targetStoreId = storeId || user.store;
  if (!targetStoreId) throw ApiError.badRequest('Store ID is required');

  if (user.role === 'MANAGER' && targetStoreId.toString() !== user.store?.toString()) {
    throw ApiError.forbidden('You can only access shifts for your own store');
  }

  const filter = { store: targetStoreId };
  if (status && status !== 'ALL') filter.status = status;
  if (startDate || endDate) {
    filter.startTime = {};
    if (startDate) filter.startTime.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filter.startTime.$lte = end;
    }
  }

  const sortObj = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  let shifts = await Shift.find(filter)
    .populate('user', 'username email')
    .sort(sortObj)
    .skip(skip)
    .limit(limit);

  if (search && search.trim()) {
    const searchLower = search.toLowerCase();
    shifts = shifts.filter(
      (shift) =>
        shift.user?.username?.toLowerCase().includes(searchLower) ||
        shift.user?.email?.toLowerCase().includes(searchLower)
    );
  }

  const total = await Shift.countDocuments(filter);
  return { shifts, pagination: buildPagination(page, limit, total) };
};

export const startBreak = async (userId, data) => {
  const { type, note } = data;

  const shift = await Shift.findOne({ user: userId, status: 'OPEN' });
  if (!shift) throw ApiError.notFound('No active shift found to start a break');

  const activeBreak = shift.breaks.find((b) => !b.endTime);
  if (activeBreak) throw ApiError.badRequest('You already have an active break');

  shift.breaks.push({ startTime: new Date(), type: type || 'OTHER', note });
  await shift.save();
  return shift;
};

export const endBreak = async (userId) => {
  const shift = await Shift.findOne({ user: userId, status: 'OPEN' });
  if (!shift) throw ApiError.notFound('No active shift found');

  const activeBreakIdx = shift.breaks.findIndex((b) => !b.endTime);
  if (activeBreakIdx === -1) throw ApiError.badRequest('No active break found to end');

  shift.breaks[activeBreakIdx].endTime = new Date();
  await shift.save();
  return shift;
};
