import api from './api';

/**
 * Store Service
 * Handles all store-related API calls
 */

const storeService = {
  /**
   * Get all stores
   * @returns {Promise} Response with stores
   */
  async getStores() {
    const response = await api.get('/stores');
    return response;
  },

  /**
   * Get store by ID
   * @param {string} id - Store ID
   * @returns {Promise} Response with store data
   */
  async getStoreById(id) {
    const response = await api.get(`/stores/${id}`);
    return response;
  },

  /**
   * Create new store
   * @param {Object} storeData - Store data
   * @returns {Promise} Response with created store
   */
  async createStore(storeData) {
    const response = await api.post('/stores', storeData);
    return response;
  },

  /**
   * Update store
   * @param {string} id - Store ID
   * @param {Object} storeData - Updated store data
   * @returns {Promise} Response with updated store
   */
  async updateStore(id, storeData) {
    const response = await api.put(`/stores/${id}`, storeData);
    return response;
  },

  /**
   * Delete store
   * @param {string} id - Store ID
   * @returns {Promise} Response
   */
  async deleteStore(id) {
    const response = await api.delete(`/stores/${id}`);
    return response;
  },
};

export default storeService;
