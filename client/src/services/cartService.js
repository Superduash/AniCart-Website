/**
 * Cart Service
 * Handles cart operations
 */

import apiClient from './api';

export const cartService = {
  /**
   * Get user's cart
   */
  getCart: async () => {
    try {
      const response = await apiClient.get('/cart');
      return { success: true, cart: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { success: false, error: message };
    }
  },

  /**
   * Add item to cart
   */
  addToCart: async (productId, quantity = 1) => {
    try {
      const response = await apiClient.post('/cart/add', {
        productId,
        quantity,
      });
      return { success: true, cart: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { success: false, error: message };
    }
  },

  /**
   * Remove item from cart
   */
  removeFromCart: async (productId) => {
    try {
      const response = await apiClient.delete(`/cart/${productId}`);
      return { success: true, cart: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { success: false, error: message };
    }
  },

  /**
   * Update item quantity
   */
  updateQuantity: async (productId, quantity) => {
    try {
      const response = await apiClient.put(`/cart/${productId}`, {
        quantity,
      });
      return { success: true, cart: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { success: false, error: message };
    }
  },

  /**
   * Clear cart
   */
  clearCart: async () => {
    try {
      const response = await apiClient.delete('/cart');
      return { success: true, cart: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { success: false, error: message };
    }
  },
};
