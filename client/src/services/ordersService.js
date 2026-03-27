/**
 * Orders Service
 * Handles order operations
 */

import apiClient from './api';

export const ordersService = {
  /**
   * Get user's orders
   */
  getOrders: async () => {
    try {
      const response = await apiClient.get('/orders');
      return { success: true, orders: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { success: false, error: message };
    }
  },

  /**
   * Get single order by ID
   */
  getOrderById: async (orderId) => {
    try {
      const response = await apiClient.get(`/orders/${orderId}`);
      return { success: true, order: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { success: false, error: message };
    }
  },

  /**
   * Create new order
   */
  createOrder: async (orderData) => {
    try {
      const response = await apiClient.post('/orders', orderData);
      return { success: true, order: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { success: false, error: message };
    }
  },

  /**
   * Cancel order
   */
  cancelOrder: async (orderId) => {
    try {
      const response = await apiClient.put(`/orders/${orderId}/cancel`);
      return { success: true, order: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { success: false, error: message };
    }
  },
};
