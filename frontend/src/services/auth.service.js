import api from './api';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

const authService = {
  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} Response with user data and tokens
   */
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response;
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise} Response with user data and tokens
   */
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response;
  },

  /**
   * Refresh access token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise} Response with new access token
   */
  async refreshToken(refreshToken) {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response;
  },

  /**
   * Logout user
   * @param {string} refreshToken - Refresh token to invalidate
   * @returns {Promise} Response
   */
  async logout(refreshToken) {
    const response = await api.post('/auth/logout', { refreshToken });
    return response;
  },

  /**
   * Change password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise} Response
   */
  async changePassword(currentPassword, newPassword) {
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response;
  },

  /**
   * Get current user profile
   * @returns {Promise} Response with user data
   */
  async getMe() {
    const response = await api.get('/auth/me');
    return response;
  },

  /**
   * Setup or reset default admin
   * @returns {Promise} Response
   */
  async setupAdmin() {
    const response = await api.post('/auth/setup-admin');
    return response;
  },
};

export default authService;
