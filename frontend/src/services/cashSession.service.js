import api from './api';

const cashSessionService = {
  getActive: (counter = 'MAIN') =>
    api.get('/cash-sessions/active', { params: { counter } }),

  open: (data) =>
    api.post('/cash-sessions/open', data),

  getSummary: (id) =>
    api.get(`/cash-sessions/${id}/summary`),

  addMovement: (data) =>
    api.post('/cash-sessions/movement', data),

  close: (id, data) =>
    api.patch(`/cash-sessions/${id}/close`, data),

  getSessions: (params = {}) =>
    api.get('/cash-sessions', { params }),
};

export default cashSessionService;
