import api from './api';

/**
 * Customer Service
 * Handles all customer-related API calls
 */

const customerService = {
  /**
   * Get all customers with pagination and search
   * @param {Object} params - Query parameters (page, limit, search)
   * @returns {Promise} Response with customers and pagination
   */
  async getCustomers(params = {}) {
    const response = await api.get('/customers', { params });
    return response;
  },

  /**
   * Get customer by ID
   * @param {string} id - Customer ID
   * @returns {Promise} Response with customer data
   */
  async getCustomerById(id) {
    const response = await api.get(`/customers/${id}`);
    return response;
  },

  /**
   * Create new customer
   * @param {Object} customerData - Customer data
   * @returns {Promise} Response with created customer
   */
  async createCustomer(customerData) {
    const response = await api.post('/customers', customerData);
    return response;
  },

  /**
   * Update customer
   * @param {string} id - Customer ID
   * @param {Object} customerData - Updated customer data
   * @returns {Promise} Response with updated customer
   */
  async updateCustomer(id, customerData) {
    const response = await api.put(`/customers/${id}`, customerData);
    return response;
  },

  /**
   * Delete customer
   * @param {string} id - Customer ID
   * @returns {Promise} Response
   */
  async deleteCustomer(id) {
    const response = await api.delete(`/customers/${id}`);
    return response;
  },

  /**
   * Update customer loyalty points
   * @param {string} id - Customer ID
   * @param {number} points - Points to add/subtract
   * @returns {Promise} Response with updated customer
   */
  async updateLoyaltyPoints(id, points) {
    const response = await api.patch(`/customers/${id}/loyalty`, { points });
    return response;
  },

  /**
   * Update customer purchase history
   * @param {string} id - Customer ID
   * @param {number} purchaseAmount - Purchase amount
   * @returns {Promise} Response with updated customer
   */
  async updatePurchaseHistory(id, purchaseAmount) {
    const response = await api.patch(`/customers/${id}/purchase`, { purchaseAmount });
    return response;
  },
};

export default customerService;
