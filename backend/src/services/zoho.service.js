import axios from 'axios';
import Integration from '../models/integration.model.js';
import ApiError from '../utils/ApiError.js';

const ZOHO_ACCOUNTS_URL = 'https://accounts.zoho.com';
const ZOHO_BOOKS_API = 'https://www.zohoapis.com/books/v3';

// ── Auth URL ────────────────────────────────────────────────────────────────

export const getAuthUrl = (storeId) => {
  const { ZOHO_CLIENT_ID, ZOHO_REDIRECT_URI } = process.env;

  if (!ZOHO_CLIENT_ID || !ZOHO_REDIRECT_URI) {
    throw new ApiError(500, 'Zoho credentials not configured. Add ZOHO_CLIENT_ID and ZOHO_REDIRECT_URI to .env');
  }

  const params = new URLSearchParams({
    scope: 'ZohoBooks.fullaccess.all',
    client_id: ZOHO_CLIENT_ID,
    response_type: 'code',
    redirect_uri: ZOHO_REDIRECT_URI,
    access_type: 'offline',
    state: storeId.toString(),
    prompt: 'consent',
  });

  return `${ZOHO_ACCOUNTS_URL}/oauth/v2/auth?${params.toString()}`;
};

// ── Exchange Auth Code for Tokens ────────────────────────────────────────────

export const exchangeCodeAndSave = async (code, storeId, userId) => {
  const { ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REDIRECT_URI } = process.env;

  // Exchange code for tokens
  const tokenRes = await axios.post(
    `${ZOHO_ACCOUNTS_URL}/oauth/v2/token`,
    null,
    {
      params: {
        code,
        client_id: ZOHO_CLIENT_ID,
        client_secret: ZOHO_CLIENT_SECRET,
        redirect_uri: ZOHO_REDIRECT_URI,
        grant_type: 'authorization_code',
      },
    }
  );

  const { access_token, refresh_token, expires_in } = tokenRes.data;

  if (!access_token) {
    throw new ApiError(400, 'Zoho returned no access token. The auth code may have expired.');
  }

  // Fetch Zoho organization info
  let organizationId = null;
  let organizationName = null;
  try {
    const orgRes = await axios.get(`${ZOHO_BOOKS_API}/organizations`, {
      headers: { Authorization: `Zoho-oauthtoken ${access_token}` },
    });
    const org = orgRes.data?.organizations?.[0];
    if (org) {
      organizationId = org.organization_id;
      organizationName = org.name;
    }
  } catch (_) {
    // Non-blocking — org info is optional
  }

  const tokenExpiry = new Date(Date.now() + (expires_in || 3600) * 1000);

  const integration = await Integration.findOneAndUpdate(
    { store: storeId, provider: 'zoho_books' },
    {
      isActive: true,
      accessToken: access_token,
      refreshToken: refresh_token,
      tokenExpiry,
      organizationId,
      organizationName,
      connectedAt: new Date(),
      connectedBy: userId,
    },
    { upsert: true, new: true }
  );

  return integration;
};

// ── Get Connection Status ────────────────────────────────────────────────────

export const getStatus = async (storeId) => {
  const integration = await Integration.findOne({ store: storeId, provider: 'zoho_books' })
    .select('-accessToken -refreshToken')
    .lean();

  if (!integration || !integration.isActive) {
    return { connected: false };
  }

  return {
    connected: true,
    organizationId: integration.organizationId,
    organizationName: integration.organizationName,
    connectedAt: integration.connectedAt,
  };
};

// ── Disconnect ───────────────────────────────────────────────────────────────

export const disconnect = async (storeId) => {
  const integration = await Integration.findOne({ store: storeId, provider: 'zoho_books' });

  if (!integration || !integration.isActive) {
    throw new ApiError(404, 'No active Zoho Books connection found');
  }

  // Revoke the token with Zoho
  if (integration.refreshToken) {
    try {
      await axios.post(`${ZOHO_ACCOUNTS_URL}/oauth/v2/token/revoke`, null, {
        params: { token: integration.refreshToken },
      });
    } catch (_) {
      // Non-blocking — revocation is best-effort
    }
  }

  integration.isActive = false;
  integration.accessToken = null;
  integration.refreshToken = null;
  await integration.save();
};
