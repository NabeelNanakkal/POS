import api from './api';

const dailySummaryService = {
  /** Compute live daily summary — not persisted */
  getSummary: (params) =>
    api.get('/daily-summary', { params }),

  /** Compute + persist snapshot to DB */
  saveSummary: (params) =>
    api.post('/daily-summary/save', null, { params }),

  /** List all active stores (for SUPER_ADMIN store dropdown) */
  getStores: () =>
    api.get('/daily-summary/stores'),

  /** Get notification settings for the current store */
  getSettings: () =>
    api.get('/daily-summary/notification-settings'),

  /** Update notification settings */
  updateSettings: (data) =>
    api.put('/daily-summary/notification-settings', data),
};

export default dailySummaryService;
