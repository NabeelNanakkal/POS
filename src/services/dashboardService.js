import api from './api';

/**
 * Dashboard Service
 * Handles all dashboard-related API calls
 */
const dashboardService = {
  /**
   * Get dashboard statistics
   * @param {Object} params - Query parameters (store)
   * @returns {Promise} Response with stats
   */
  async getDashboardStats(params = {}) {
    const response = await api.get('/dashboard/stats', { params });
    return response;
  },

  /**
   * Get dashboard activity (chart data)
   * @param {Object} params - Query parameters (store)
   * @returns {Promise} Response with chart data
   */
  async getActivityCounts(params = {}) {
    const response = await api.get('/dashboard/activity', { params });
    return response;
  }
};

export default dashboardService;
