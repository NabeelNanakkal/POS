import axios from 'axios';
import Integration from '../models/integration.model.js';
import { ZohoSale, ZohoPurchase, ZohoPayment, ZohoSyncLog } from '../models/zohoReport.model.js';
import { getValidAccessToken } from './zoho.service.js';
import logger from '../utils/logger.js';

const ZOHO_BOOKS_API = 'https://www.zohoapis.com/books/v3';

// ── Fetch all pages from a Zoho Books list endpoint ───────────────────────────
const fetchAllPages = async (url, baseParams, headers, dataKey) => {
  const results = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    try {
      const res = await axios.get(url, {
        headers,
        params: { ...baseParams, page, per_page: 200 },
        timeout: 30000,
      });

      if (res.data?.code !== 0) {
        logger.warn(`Zoho API [${dataKey}] non-zero code ${res.data?.code}: ${res.data?.message}`);
        break;
      }

      const items = res.data[dataKey] || [];
      results.push(...items);
      hasMore = res.data?.page_context?.has_more_page === true;
      page++;

      // Respect Zoho rate limits (~100 req/min)
      if (hasMore) await new Promise((r) => setTimeout(r, 350));
    } catch (err) {
      logger.error(`Zoho fetchAllPages [${dataKey}] p${page}: ${err.message}`);
      break;
    }
  }

  return results;
};

// ── Sync invoices (sales) for one store ───────────────────────────────────────
const syncSales = async (storeId, tokenInfo, dateParams) => {
  const { accessToken, organizationId } = tokenInfo;
  const headers = { Authorization: `Zoho-oauthtoken ${accessToken}` };
  const params = { organization_id: organizationId, ...dateParams };

  const invoices = await fetchAllPages(`${ZOHO_BOOKS_API}/invoices`, params, headers, 'invoices');
  if (!invoices.length) return 0;

  const ops = invoices.map((inv) => ({
    updateOne: {
      filter: { store: storeId, zohoInvoiceId: inv.invoice_id },
      update: {
        $set: {
          invoiceNumber:   inv.invoice_number  || '',
          referenceNumber: inv.reference_number || '',
          date:            inv.date ? new Date(inv.date) : null,
          customerId:      inv.customer_id     || '',
          customerName:    inv.customer_name   || 'Walk-in Customer',
          status:          inv.status          || 'sent',
          subTotal:        parseFloat(inv.sub_total)                              || 0,
          totalTax:        parseFloat(inv.tax_total ?? inv.total_tax_amount)      || 0,
          discount:        parseFloat(inv.discount_total ?? inv.discount_amount ?? inv.discount) || 0,
          total:           parseFloat(inv.total)                                  || 0,
          balance:         parseFloat(inv.balance)                                || 0,
          syncedAt:        new Date(),
        },
      },
      upsert: true,
    },
  }));

  await ZohoSale.bulkWrite(ops, { ordered: false });
  return invoices.length;
};

// ── Sync bills (purchases) for one store ──────────────────────────────────────
const syncPurchases = async (storeId, tokenInfo, dateParams) => {
  const { accessToken, organizationId } = tokenInfo;
  const headers = { Authorization: `Zoho-oauthtoken ${accessToken}` };
  const params = { organization_id: organizationId, ...dateParams };

  const bills = await fetchAllPages(`${ZOHO_BOOKS_API}/bills`, params, headers, 'bills');
  if (!bills.length) return 0;

  const ops = bills.map((bill) => ({
    updateOne: {
      filter: { store: storeId, zohoBillId: bill.bill_id },
      update: {
        $set: {
          billNumber: bill.bill_number || '',
          date:       bill.date ? new Date(bill.date) : null,
          vendorId:   bill.vendor_id   || '',
          vendorName: bill.vendor_name || '',
          status:     bill.status      || 'open',
          subTotal:   parseFloat(bill.sub_total)                         || 0,
          totalTax:   parseFloat(bill.tax_total ?? bill.total_tax_amount) || 0,
          total:      parseFloat(bill.total)                              || 0,
          balance:    parseFloat(bill.balance)                            || 0,
          syncedAt:   new Date(),
        },
      },
      upsert: true,
    },
  }));

  await ZohoPurchase.bulkWrite(ops, { ordered: false });
  return bills.length;
};

// ── Sync customer payments for one store ──────────────────────────────────────
const syncPayments = async (storeId, tokenInfo, dateParams) => {
  const { accessToken, organizationId } = tokenInfo;
  const headers = { Authorization: `Zoho-oauthtoken ${accessToken}` };
  const params = { organization_id: organizationId, ...dateParams };

  const payments = await fetchAllPages(
    `${ZOHO_BOOKS_API}/customerpayments`,
    params,
    headers,
    'customerpayments',
  );
  if (!payments.length) return 0;

  const ops = payments.map((p) => ({
    updateOne: {
      filter: { store: storeId, zohoPaymentId: p.payment_id },
      update: {
        $set: {
          date:         p.date ? new Date(p.date) : null,
          customerName: p.customer_name  || '',
          paymentMode:  p.payment_mode   || 'cash',
          amount:       parseFloat(p.amount) || 0,
          invoiceId:    p.invoices?.[0]?.invoice_id || '',
          syncedAt:     new Date(),
        },
      },
      upsert: true,
    },
  }));

  await ZohoPayment.bulkWrite(ops, { ordered: false });
  return payments.length;
};

// ── Sync all data for one store ───────────────────────────────────────────────
export const syncStoreData = async (storeId, { full = false } = {}) => {
  if (!storeId) {
    logger.warn('Zoho syncStoreData called without storeId — skipping');
    return;
  }

  let log = null;
  try {
    // Avoid duplicate concurrent syncs
    const running = await ZohoSyncLog.findOne({ store: storeId, status: 'running' });
    if (running) {
      const ageMs = Date.now() - new Date(running.startedAt).getTime();
      if (ageMs < 15 * 60 * 1000) return; // still running, bail out
      await ZohoSyncLog.findByIdAndUpdate(running._id, { status: 'failed', error: 'Timed out' });
    }

    log = await ZohoSyncLog.create({
      store:     storeId,
      syncType:  full ? 'full' : 'incremental',
      startedAt: new Date(),
    });

    const tokenInfo = await getValidAccessToken(storeId);
    if (!tokenInfo) {
      await ZohoSyncLog.findByIdAndUpdate(log._id, {
        status: 'failed', completedAt: new Date(), error: 'No active Zoho connection',
      });
      return;
    }

    // Full sync: last 180 days. Incremental: last 25 hours (safe overlap window)
    const since = full
      ? new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
      : new Date(Date.now() - 25 * 60 * 60 * 1000);

    const dateStr = since.toISOString().split('T')[0];
    const dateParams = { date_start: dateStr };

    const [salesCount, purchasesCount, paymentsCount] = await Promise.all([
      syncSales(storeId, tokenInfo, dateParams),
      syncPurchases(storeId, tokenInfo, dateParams),
      syncPayments(storeId, tokenInfo, dateParams),
    ]);

    await ZohoSyncLog.findByIdAndUpdate(log._id, {
      status:          'success',
      completedAt:     new Date(),
      salesSynced:     salesCount,
      purchasesSynced: purchasesCount,
      paymentsSynced:  paymentsCount,
    });

    logger.info(
      `Zoho sync OK [${storeId}]: ${salesCount} sales, ${purchasesCount} purchases, ${paymentsCount} payments`,
    );
  } catch (err) {
    logger.error(`Zoho sync failed [${storeId}]: ${err.message}`);
    if (log?._id) {
      await ZohoSyncLog.findByIdAndUpdate(log._id, {
        status: 'failed', completedAt: new Date(), error: err.message,
      }).catch(() => {});
    }
  }
};

// ── Sync all actively connected stores (called by interval) ──────────────────
export const syncAllStores = async () => {
  try {
    const integrations = await Integration
      .find({ provider: 'zoho_books', isActive: true })
      .select('store')
      .lean();

    if (!integrations.length) return;

    logger.info(`Zoho auto-sync: ${integrations.length} store(s)`);

    // Sequential to avoid hammering Zoho rate limits
    for (const integration of integrations) {
      await syncStoreData(integration.store);
    }
  } catch (err) {
    logger.error(`Zoho syncAllStores error: ${err.message}`);
  }
};

// ── Get last sync status for a store ─────────────────────────────────────────
export const getLastSyncStatus = async (storeId) => {
  const [lastLog, sales, purchases, payments] = await Promise.all([
    ZohoSyncLog.findOne({ store: storeId }).sort({ startedAt: -1 }).lean(),
    ZohoSale.countDocuments({ store: storeId }),
    ZohoPurchase.countDocuments({ store: storeId }),
    ZohoPayment.countDocuments({ store: storeId }),
  ]);

  return {
    lastSync: lastLog || null,
    counts: { sales, purchases, payments },
  };
};
