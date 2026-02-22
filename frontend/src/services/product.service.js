import api from './api';

/**
 * Product Service
 * Handles all product-related API calls
 */

const productService = {
  /**
   * Get all products with pagination and filters
   * @param {Object} params - Query parameters (page, limit, search, category, isActive)
   * @returns {Promise} Response with products and pagination
   */
  async getProducts(params = {}) {
    const response = await api.get('/products', { params });
    return response;
  },

  /**
   * Get product by ID
   * @param {string} id - Product ID
   * @returns {Promise} Response with product data
   */
  async getProductById(id) {
    const response = await api.get(`/products/${id}`);
    return response;
  },

  /**
   * Create new product
   * @param {Object} productData - Product data
   * @returns {Promise} Response with created product
   */
  async createProduct(productData) {
    const response = await api.post('/products', productData);
    return response;
  },

  /**
   * Update product
   * @param {string} id - Product ID
   * @param {Object} productData - Updated product data
   * @returns {Promise} Response with updated product
   */
  async updateProduct(id, productData) {
    const response = await api.put(`/products/${id}`, productData);
    return response;
  },

  /**
   * Delete product
   * @param {string} id - Product ID
   * @returns {Promise} Response
   */
  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`);
    return response;
  },

  /**
   * Get low stock products
   * @returns {Promise} Response with low stock products
   */
  async getLowStockProducts() {
    const response = await api.get('/products/low-stock');
    return response;
  },

  /**
   * Bulk create products
   * @param {Array} products - Array of product objects
   * @returns {Promise} Response
   */
  async bulkCreateProducts(products) {
    const response = await api.post('/products/bulk', { products });
    return response;
  },

  async getProductStats() {
    const response = await api.get('/products/stats');
    return response;
  },

  async adjustStock(id, data) {
    const response = await api.put(`/products/adjust-stock/${id}`, data);
    return response;
  }
};

export default productService;
