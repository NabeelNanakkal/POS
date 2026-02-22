import api from './api';

const zohoService = {
  getAuthUrl: (storeId) =>
    api.get('/zoho/auth-url', { params: { storeId } }),

  getStatus: () =>
    api.get('/zoho/status'),

  disconnect: () =>
    api.delete('/zoho/disconnect'),
};

export default zohoService;
