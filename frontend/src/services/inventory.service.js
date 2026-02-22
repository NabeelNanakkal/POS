import api from './api';

/**
 * Inventory Service
 * Handles all inventory-related API calls
 */

const inventoryService = {
  /**
   * Get inventory
   * @param {Object} params - Query parameters (store, lowStock)
   * @returns {Promise} Response with inventory
   */
  async getInventory(params = {}) {
    const response = await api.get('/inventory', { params });
    return response;
  },

  /**
   * Get inventory by ID
   * @param {string} id - Inventory ID
   * @returns {Promise} Response with inventory data
   */
  async getInventoryById(id) {
    const response = await api.get(`/inventory/${id}`);
    return response;
  },

  /**
   * Adjust inventory stock
   * @param {Object} adjustmentData - { product, store, quantity, type: 'add'|'subtract' }
   * @returns {Promise} Response with updated inventory
   */
  async adjustInventory(adjustmentData) {
    const response = await api.post('/inventory/adjust', adjustmentData);
    return response;
  },

  /**
   * Transfer inventory between stores
   * @param {Object} transferData - { product, fromStore, toStore, quantity }
   * @returns {Promise} Response with transfer result
   */
  async transferInventory(transferData) {
    const response = await api.post('/inventory/transfer', transferData);
    return response;
  },

  /**
   * Get low stock alerts
   * @param {Object} params - Query parameters (store)
   * @returns {Promise} Response with low stock items
   */
  async getLowStockAlerts(params = {}) {
    const response = await api.get('/inventory/alerts', { params });
    return response;
  },
};

export default inventoryService;
