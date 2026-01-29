import api from './api';

const shiftService = {
  // Start a new shift
  startShift: (data) => api.post('/shifts/start', data),

  // End current shift
  endShift: (data) => api.post('/shifts/end', data),

  // Get current active shift
  getCurrentShift: () => api.get('/shifts/current'),

  // Add cash movement (Pay In / Pay Out)
  addCashMovement: (data) => api.post('/shifts/movement', data),

  // Get shift history
  getShiftHistory: (params) => api.get('/shifts/history', { params })
};

export default shiftService;
