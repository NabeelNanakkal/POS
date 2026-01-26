import api from './api';

/**
 * Payment Service
 * Handles all payment-related API calls
 */

const paymentService = {
  /**
   * Get all payments with pagination and filters
   * @param {Object} params - Query parameters (page, limit, status, method, startDate, endDate)
   * @returns {Promise} Response with payments and pagination
   */
  async getPayments(params = {}) {
    const response = await api.get('/payments', { params });
    return response;
  },

  /**
   * Get payment by ID
   * @param {string} id - Payment ID
   * @returns {Promise} Response with payment data
   */
  async getPaymentById(id) {
    const response = await api.get(`/payments/${id}`);
    return response;
  },

  /**
   * Create/process payment
   * @param {Object} paymentData - Payment data
   * @returns {Promise} Response with created payment
   */
  async createPayment(paymentData) {
    const response = await api.post('/payments', paymentData);
    return response;
  },

  /**
   * Get payment statistics
   * @param {Object} params - Query parameters (startDate, endDate)
   * @returns {Promise} Response with payment stats
   */
  async getPaymentStats(params = {}) {
    const response = await api.get('/payments/stats', { params });
    return response;
  },
};

export default paymentService;
