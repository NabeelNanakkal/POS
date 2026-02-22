import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import * as zohoService from '../services/zoho.service.js';
import Store from '../models/store.model.js';

// GET /api/zoho/auth-url
export const getAuthUrl = asyncHandler(async (req, res) => {
  // req.storeId is set by verifyToken for non-super-admins
  const storeId = req.storeId || req.user?.store;
  if (!storeId) throw new ApiError(400, 'No store associated with this account');
  const url = zohoService.getAuthUrl(storeId);
  res.json(ApiResponse.success({ url }, 'Zoho auth URL generated'));
});

// GET /api/zoho/callback  (Zoho redirects here after user authorises)
export const handleCallback = asyncHandler(async (req, res) => {
  const { code, state: storeId, error } = req.query;
  const frontendBase = process.env.FRONTEND_URL || 'http://localhost:3002';

  if (error || !code) {
    return res.redirect(`${frontendBase}/settings/integrations?zoho=error&reason=${error || 'missing_code'}`);
  }

  try {
    await zohoService.exchangeCodeAndSave(code, storeId);
    const store = await Store.findById(storeId).select('code').lean();
    const storeCode = store?.code || 'default';
    res.redirect(`${frontendBase}/pos/${storeCode}/settings/integrations?zoho=success`);
  } catch (err) {
    // Try to still redirect back to the right page
    try {
      const store = await Store.findById(storeId).select('code').lean();
      const storeCode = store?.code || 'default';
      res.redirect(`${frontendBase}/pos/${storeCode}/settings/integrations?zoho=error&reason=token_exchange_failed`);
    } catch {
      res.redirect(`${frontendBase}/settings/integrations?zoho=error&reason=token_exchange_failed`);
    }
  }
});

// GET /api/zoho/status
export const getStatus = asyncHandler(async (req, res) => {
  const storeId = req.storeId || req.user?.store;
  if (!storeId) throw new ApiError(400, 'No store associated with this account');
  const status = await zohoService.getStatus(storeId);
  res.json(ApiResponse.success(status, 'Zoho connection status'));
});

// DELETE /api/zoho/disconnect
export const disconnectZoho = asyncHandler(async (req, res) => {
  const storeId = req.storeId || req.user?.store;
  if (!storeId) throw new ApiError(400, 'No store associated with this account');
  await zohoService.disconnect(storeId);
  res.json(ApiResponse.success(null, 'Zoho Books disconnected successfully'));
});
