/**
 * API Client Configuration
 * Centralized Axios instance for all API requests
 */

import axios from 'axios';

// Get API URL from environment or default
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

// Create axios instance with interceptors
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('anicart_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth on unauthorized
      localStorage.removeItem('anicart_token');
      localStorage.removeItem('anicart_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
