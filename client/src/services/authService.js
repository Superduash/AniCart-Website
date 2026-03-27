/**
 * Authentication Service
 * Handles login, signup, and auth operations
 */

import apiClient from './api';

export const authService = {
  /**
   * Signup - Create new user account
   */
  signup: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      const { accessToken, user } = response.data.data;
      
      // Store token and user
      localStorage.setItem('anicart_token', accessToken);
      localStorage.setItem('anicart_user', JSON.stringify(user));
      
      return { success: true, user, token: accessToken };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { success: false, error: message };
    }
  },

  /**
   * Login - Authenticate user
   */
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const { accessToken, user } = response.data.data;
      
      // Store token and user
      localStorage.setItem('anicart_token', accessToken);
      localStorage.setItem('anicart_user', JSON.stringify(user));
      
      return { success: true, user, token: accessToken };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { success: false, error: message };
    }
  },

  /**
   * Logout - Clear auth data
   */
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
      localStorage.removeItem('anicart_token');
      localStorage.removeItem('anicart_user');
      return { success: true };
    } catch (error) {
      // Clear even if request fails
      localStorage.removeItem('anicart_token');
      localStorage.removeItem('anicart_user');
      return { success: true };
    }
  },

  /**
   * Verify token - Check if user is authenticated
   */
  verifyToken: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return { success: true, user: response.data.data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get current user
   */
  getCurrentUser: () => {
    const user = localStorage.getItem('anicart_user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('anicart_token');
  },
};
