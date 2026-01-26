/**
 * Token Manager Utility
 * Handles storage and retrieval of JWT tokens
 */

const ACCESS_TOKEN_KEY = 'accessToken'; // Hardcoded for stability
console.log('TokenManager initialized. Key:', ACCESS_TOKEN_KEY);
const REFRESH_TOKEN_KEY = import.meta.env.VITE_APP_REFRESH_TOKEN || 'refreshToken';

export const tokenManager = {
  /**
   * Get access token from localStorage
   */
  getAccessToken() {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token || token === 'null' || token === 'undefined') return null;
    return token;
  },

  /**
   * Get refresh token from localStorage
   */
  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Store both access and refresh tokens
   */
  setTokens(accessToken, refreshToken) {
    if (accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    }
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  },

  /**
   * Clear all tokens (on logout)
   */
  clearTokens() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Check if token exists
   */
  hasToken() {
    return !!this.getAccessToken();
  },

  /**
   * Decode JWT token (without verification)
   */
  decodeToken(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  },

  /**
   * Check if token is expired
   */
  isTokenExpired(token) {
    if (!token) return true;
    
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  },

  /**
   * Get user info from token
   */
  getUserFromToken() {
    const token = this.getAccessToken();
    if (!token) return null;
    
    return this.decodeToken(token);
  }
};

export default tokenManager;
