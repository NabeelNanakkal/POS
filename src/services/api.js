import axios from 'axios';
import { tokenManager } from '../utils/tokenManager';
import { toast } from 'react-toastify';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_ENDPOINT || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken();
    
    if (token && token !== 'null' && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    // Return the data directly for successful responses
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized - Token expired
    if (error.response.status === 401 && !originalRequest._retry) {
      const errorMessage = error.response.data?.message;
      
      // If token is invalid (signature mismatch, malformed), don't try to refresh
      if (errorMessage && (errorMessage.includes('Invalid token') || errorMessage.includes('jwt malformed'))) {
        console.warn('Invalid token detected, clearing session...');
        tokenManager.clearTokens();
        localStorage.clear(); // Nuclear option to ensure no stale data
        window.location.replace('/login');
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenManager.getRefreshToken();

      if (!refreshToken) {
        // No refresh token, redirect to login
        tokenManager.clearTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Try to refresh the token
        const response = await axios.post(
          `${import.meta.env.VITE_APP_API_ENDPOINT}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken } = response.data.data;
        tokenManager.setTokens(accessToken, refreshToken);

        // Update the authorization header
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        isRefreshing = false;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        
        // Refresh failed, clear tokens and redirect to login
        tokenManager.clearTokens();
        toast.error('Session expired. Please login again.');
        
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
        
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden
    if (error.response.status === 403) {
      toast.error('You do not have permission to perform this action.');
    }

    // Handle 404 Not Found
    if (error.response.status === 404) {
      toast.error(error.response.data?.message || 'Resource not found.');
    }

    // Handle 500 Internal Server Error
    if (error.response.status >= 500) {
      toast.error('Server error. Please try again later.');
    }

    // Return error message from backend
    const errorMessage = error.response.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
