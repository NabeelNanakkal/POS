import axios from 'axios';
import Integration from '../models/integration.model.js';
import Product from '../models/product.model.js';
import Customer from '../models/customer.model.js';
import Order from '../models/order.model.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

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

// ── Get Valid Access Token (auto-refresh if expired) ──────────────────────────

export const getValidAccessToken = async (storeId) => {
  const integration = await Integration.findOne({ store: storeId, provider: 'zoho_books' });
  if (!integration || !integration.isActive) return null;

  // Refresh 5 minutes before expiry
  const bufferMs = 5 * 60 * 1000;
  if (!integration.tokenExpiry || integration.tokenExpiry < new Date(Date.now() + bufferMs)) {
    const { ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET } = process.env;
    const res = await axios.post(`${ZOHO_ACCOUNTS_URL}/oauth/v2/token`, null, {
      params: {
        refresh_token: integration.refreshToken,
        client_id: ZOHO_CLIENT_ID,
        client_secret: ZOHO_CLIENT_SECRET,
        grant_type: 'refresh_token',
      },
    });
    const { access_token, expires_in } = res.data;
    if (!access_token) throw new Error('Token refresh failed — no access_token returned');
    integration.accessToken = access_token;
    integration.tokenExpiry = new Date(Date.now() + (expires_in || 3600) * 1000);
    await integration.save();
  }

  return { accessToken: integration.accessToken, organizationId: integration.organizationId };
};

// ── Sync Product → Zoho Item ──────────────────────────────────────────────────

export const syncProductToZoho = async (product, storeId) => {
  try {
    const tokenInfo = await getValidAccessToken(storeId);
    if (!tokenInfo) return; // Store not connected to Zoho

    const { accessToken, organizationId } = tokenInfo;
    const headers = { Authorization: `Zoho-oauthtoken ${accessToken}` };
    const params = { organization_id: organizationId };

    const itemPayload = {
      name: product.name,
      rate: product.price,
      description: product.description || '',
      sku: product.sku,
      product_type: product.productType === 'Service' ? 'service' : 'goods',
      unit: product.usageUnit || 'pcs',
      purchase_rate: product.cost,
      is_taxable: (product.taxRate || 0) > 0,
    };

    if (product.zohoItemId) {
      await axios.put(`${ZOHO_BOOKS_API}/items/${product.zohoItemId}`, itemPayload, { headers, params });
      logger.info(`Zoho: updated item for product ${product.sku}`);
    } else {
      const res = await axios.post(`${ZOHO_BOOKS_API}/items`, itemPayload, { headers, params });
      const zohoItemId = res.data?.item?.item_id;
      if (zohoItemId) {
        await Product.findByIdAndUpdate(product._id, { zohoItemId });
        logger.info(`Zoho: created item ${zohoItemId} for product ${product.sku}`);
      }
    }
  } catch (err) {
    logger.error(`Zoho product sync failed [${product?.sku}]: ${err.message}`);
  }
};

// ── Sync Customer → Zoho Contact ─────────────────────────────────────────────

export const syncCustomerToZoho = async (customer, storeId) => {
  try {
    const tokenInfo = await getValidAccessToken(storeId);
    if (!tokenInfo) return null;

    const { accessToken, organizationId } = tokenInfo;
    const headers = { Authorization: `Zoho-oauthtoken ${accessToken}` };
    const params = { organization_id: organizationId };

    const contactPayload = {
      contact_name: customer.name,
      contact_type: 'customer',
      ...(customer.email && { email: customer.email }),
      ...(customer.phone && { phone: customer.phone }),
      ...(customer.address?.city && {
        billing_address: {
          street: customer.address.street || '',
          city: customer.address.city || '',
          state: customer.address.state || '',
          zip: customer.address.zipCode || '',
          country: customer.address.country || '',
        },
      }),
    };

    if (customer.zohoContactId) {
      await axios.put(`${ZOHO_BOOKS_API}/contacts/${customer.zohoContactId}`, contactPayload, { headers, params });
      logger.info(`Zoho: updated contact for customer ${customer._id}`);
      return customer.zohoContactId;
    } else {
      const res = await axios.post(`${ZOHO_BOOKS_API}/contacts`, contactPayload, { headers, params });
      const zohoContactId = res.data?.contact?.contact_id;
      if (zohoContactId) {
        await Customer.findByIdAndUpdate(customer._id, { zohoContactId });
        logger.info(`Zoho: created contact ${zohoContactId} for customer ${customer._id}`);
      }
      return zohoContactId || null;
    }
  } catch (err) {
    logger.error(`Zoho customer sync failed [${customer?._id}]: ${err.message}`);
    return null;
  }
};

// ── Sync Order → Zoho Invoice + Payment ──────────────────────────────────────

// Map POS payment methods to Zoho Books accepted payment modes
const ZOHO_PAYMENT_MODE_MAP = {
  cash: 'cash',
  card: 'creditcard',
  digital: 'others',
  upi: 'banktransfer',
  wallet: 'others',
  other: 'others',
};

export const syncOrderToZoho = async (order, storeId) => {
  try {
    if (order.status !== 'COMPLETED') return;

    // Skip if already synced to avoid duplicate invoices in Zoho
    if (order.zohoInvoiceId) {
      logger.info(`Zoho: order ${order.orderNumber} already synced (${order.zohoInvoiceId}), skipping`);
      return;
    }

    const tokenInfo = await getValidAccessToken(storeId);
    if (!tokenInfo) return;

    const { accessToken, organizationId } = tokenInfo;
    const headers = { Authorization: `Zoho-oauthtoken ${accessToken}` };
    const params = { organization_id: organizationId };

    // Sync customer first (if order has one) to get Zoho contact ID
    // Handle both populated Mongoose document and raw ObjectId
    let zohoCustomerId = null;
    if (order.customer) {
      const customerId = order.customer._id || order.customer;
      const customer = await Customer.findById(customerId);
      if (customer) {
        zohoCustomerId = customer.zohoContactId || await syncCustomerToZoho(customer, storeId);
      }
    }

    // Build line items — use zohoItemId if already synced
    const lineItems = await Promise.all(order.items.map(async (item) => {
      let zohoItemId = null;
      if (item.product) {
        const product = await Product.findById(item.product).select('zohoItemId').lean();
        zohoItemId = product?.zohoItemId || null;
      }
      return {
        ...(zohoItemId ? { item_id: zohoItemId } : { name: item.name }),
        quantity: item.quantity,
        rate: item.price,
        ...(item.discount > 0 && { discount: item.discount }),
      };
    }));

    const invoiceDate = new Date(order.createdAt).toISOString().split('T')[0];

    const invoicePayload = {
      ...(zohoCustomerId ? { customer_id: zohoCustomerId } : { customer_name: 'Walk-in Customer' }),
      reference_number: order.orderNumber, // store POS order number as reference (Zoho auto-generates invoice_number)
      date: invoiceDate,
      line_items: lineItems,
      ...(order.notes && { notes: order.notes }),
    };

    const invoiceRes = await axios.post(`${ZOHO_BOOKS_API}/invoices`, invoicePayload, { headers, params });

    // Zoho returns HTTP 200 even for business errors — check the code field
    if (invoiceRes.data?.code !== 0) {
      logger.error(`Zoho: invoice creation failed for order ${order.orderNumber}: [${invoiceRes.data?.code}] ${invoiceRes.data?.message}`);
      return;
    }

    const zohoInvoiceId = invoiceRes.data?.invoice?.invoice_id;
    if (!zohoInvoiceId) {
      logger.warn(`Zoho: invoice_id missing in response for order ${order.orderNumber}: ${JSON.stringify(invoiceRes.data)}`);
      return;
    }

    await Order.findByIdAndUpdate(order._id, { zohoInvoiceId });
    logger.info(`Zoho: created invoice ${zohoInvoiceId} for order ${order.orderNumber}`);

    // Record payment if order is fully paid
    if (order.paymentStatus === 'PAID' && order.payments?.length) {
      const rawMethod = order.payments[0].method?.toLowerCase() || 'cash';
      const paymentMode = ZOHO_PAYMENT_MODE_MAP[rawMethod] || 'cash';
      const paymentPayload = {
        ...(zohoCustomerId ? { customer_id: zohoCustomerId } : { customer_name: 'Walk-in Customer' }),
        payment_mode: paymentMode,
        amount: order.total,
        date: invoiceDate,
        invoices: [{ invoice_id: zohoInvoiceId, amount_applied: order.total }],
      };
      const paymentRes = await axios.post(`${ZOHO_BOOKS_API}/customerpayments`, paymentPayload, { headers, params });
      if (paymentRes.data?.code === 0) {
        logger.info(`Zoho: recorded payment for invoice ${zohoInvoiceId}`);
      } else {
        logger.warn(`Zoho: payment recording failed for invoice ${zohoInvoiceId}: [${paymentRes.data?.code}] ${paymentRes.data?.message}`);
      }
    }
  } catch (err) {
    logger.error(`Zoho order sync failed [${order?.orderNumber}]: ${err.message}`);
    if (err.response?.data) {
      logger.error(`Zoho API error details: ${JSON.stringify(err.response.data)}`);
    }
  }
};
