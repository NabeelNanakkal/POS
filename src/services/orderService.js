import api from './api';

/**
 * Order Service
 * Handles all order-related API calls
 */

const orderService = {
  /**
   * Get all orders with pagination and filters
   * @param {Object} params - Query parameters (page, limit, status, store, startDate, endDate)
   * @returns {Promise} Response with orders and pagination
   */
  async getOrders(params = {}) {
    const response = await api.get('/orders', { params });
    return response;
  },

  /**
   * Get order by ID
   * @param {string} id - Order ID
   * @returns {Promise} Response with order data
   */
  async getOrderById(id) {
    const response = await api.get(`/orders/${id}`);
    return response;
  },

  /**
   * Create new order
   * @param {Object} orderData - Order data
   * @returns {Promise} Response with created order
   */
  async createOrder(orderData) {
    const response = await api.post('/orders', orderData);
    return response;
  },

  /**
   * Update order status
   * @param {string} id - Order ID
   * @param {string} status - New status
   * @returns {Promise} Response with updated order
   */
  async updateOrderStatus(id, status) {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response;
  },

  /**
   * Process order refund
   * @param {string} id - Order ID
   * @returns {Promise} Response with refunded order
   */
  async refundOrder(id) {
    const response = await api.post(`/orders/${id}/refund`);
    return response;
  },

  /**
   * Get order statistics
   * @param {Object} params - Query parameters (startDate, endDate, store)
   * @returns {Promise} Response with order stats
   */
  async getOrderStats(params = {}) {
    const response = await api.get('/orders/stats', { params });
    return response;
  },
};

export default orderService;
