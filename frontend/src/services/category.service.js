import api from './api';

/**
 * Category Service
 * Handles all category-related API calls
 */

const categoryService = {
  /**
   * Get all categories
   * @returns {Promise} Response with categories
   */
  async getCategories() {
    const response = await api.get('/categories');
    return response;
  },

  /**
   * Get category by ID
   * @param {string} id - Category ID
   * @returns {Promise} Response with category data
   */
  async getCategoryById(id) {
    const response = await api.get(`/categories/${id}`);
    return response;
  },

  /**
   * Create new category
   * @param {Object} categoryData - Category data
   * @returns {Promise} Response with created category
   */
  async createCategory(categoryData) {
    const response = await api.post('/categories', categoryData);
    return response;
  },

  /**
   * Update category
   * @param {string} id - Category ID
   * @param {Object} categoryData - Updated category data
   * @returns {Promise} Response with updated category
   */
  async updateCategory(id, categoryData) {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response;
  },

  /**
   * Delete category
   * @param {string} id - Category ID
   * @returns {Promise} Response
   */
  async deleteCategory(id) {
    const response = await api.delete(`/categories/${id}`);
    return response;
  },
};

export default categoryService;
