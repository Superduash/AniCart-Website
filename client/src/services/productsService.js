/**
 * Products Service
 * Handles product fetching and operations
 */

import apiClient from './api';

export const productsService = {
  /**
   * Get all products
   */
  getAllProducts: async (params = {}) => {
    try {
      const response = await apiClient.get('/products', { params });
      return { success: true, products: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { success: false, error: message };
    }
  },

  /**
   * Get single product by ID
   */
  getProductById: async (productId) => {
    try {
      const response = await apiClient.get(`/products/${productId}`);
      return { success: true, product: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { success: false, error: message };
    }
  },

  /**
   * Search products
   */
  searchProducts: async (query) => {
    try {
      const response = await apiClient.get('/products/search', {
        params: { q: query },
      });
      return { success: true, products: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { success: false, error: message };
    }
  },

  /**
   * Get featured products
   */
  getFeaturedProducts: async () => {
    try {
      const response = await apiClient.get('/products/featured');
      return { success: true, products: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { success: false, error: message };
    }
  },
};
