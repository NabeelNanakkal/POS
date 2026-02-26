import api from './api';

const zohoReportService = {
  getSyncStatus: () =>
    api.get('/zoho-reports/sync-status'),

  triggerSync: (full = false) =>
    api.post('/zoho-reports/sync', null, { params: { full } }),

  getSummary: (params) =>
    api.get('/zoho-reports/summary', { params }),

  getSales: (params) =>
    api.get('/zoho-reports/sales', { params }),

  getPurchases: (params) =>
    api.get('/zoho-reports/purchases', { params }),

  getPayments: (params) =>
    api.get('/zoho-reports/payments', { params }),
};

export default zohoReportService;
