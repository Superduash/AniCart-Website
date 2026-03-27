/**
 * Order Controller
 * 
 * Handles order operations including checkout (creating orders from cart),
 * retrieving order history, and getting single order details.
 */

const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const Product = require('../models/Product');
const { successResponse, paginatedResponse } = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');
const CONSTANTS = require('../utils/constants');

/**
 * @desc    Create order from cart (checkout)
 * @route   POST /api/orders/checkout
 * @access  Private
 */
const checkout = catchAsync(async (req, res) => {
  // Get user's cart with populated products
  const cart = await Cart.findOne({ user: req.user.id }).populate({
    path: 'items.product',
    select: '-__v',
  });

  if (!cart || cart.items.length === 0) {
    throw ApiError.badRequest('Cart is empty');
  }

  // Verify all products are still active
  const inactiveItems = cart.items.filter((item) => !item.product?.isActive);
  if (inactiveItems.length > 0) {
    const productNames = inactiveItems.map((item) => item.product?.name || 'Unknown');
    throw ApiError.badRequest(
      `Some items are no longer available: ${productNames.join(', ')}`
    );
  }

  // Create order from cart
  const order = await Order.createFromCart(req.user.id, cart.items);

  // Add purchased products to user's library
  const purchasedProductIds = cart.items.map((item) => item.product._id);
  await User.findByIdAndUpdate(req.user.id, {
    $addToSet: { library: { $each: purchasedProductIds } },
    $inc: { 
      purchasesCount: cart.items.reduce((sum, item) => sum + item.qty, 0),
      points: Math.floor(order.total * 10), // Award 10 points per dollar spent
    },
  });

  // Clear the cart
  await cart.clearCart();

  // Return order with populated data
  const populatedOrder = await Order.findById(order._id).populate({
    path: 'items.product',
    select: '-__v',
  });

  res.status(201).json(
    successResponse({
      message: 'Order placed successfully',
      data: { order: populatedOrder },
    })
  );
});

/**
 * @desc    Get user's order history
 * @route   GET /api/orders
 * @access  Private
 */
const getOrders = catchAsync(async (req, res) => {
  const { page = 1, limit = CONSTANTS.DEFAULTS.PAGE_LIMIT, status } = req.query;

  // Build filter
  const filter = { user: req.user.id };
  if (status) {
    filter.status = status;
  }

  // Parse pagination parameters
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(
    CONSTANTS.LIMITS.MAX_PAGE_SIZE,
    Math.max(1, parseInt(limit, 10))
  );
  const skip = (pageNum - 1) * limitNum;

  // Execute query with pagination
  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate({
        path: 'items.product',
        select: '-__v',
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Order.countDocuments(filter),
  ]);

  res.status(200).json(
    paginatedResponse({
      message: 'Orders retrieved successfully',
      data: orders,
      page: pageNum,
      limit: limitNum,
      total,
    })
  );
});

/**
 * @desc    Get single order detail
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrder = catchAsync(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findOne({
    _id: id,
    user: req.user.id,
  }).populate({
    path: 'items.product',
    select: '-__v',
  });

  if (!order) {
    throw ApiError.notFound('Order not found');
  }

  res.status(200).json(
    successResponse({
      message: 'Order retrieved successfully',
      data: { order },
    })
  );
});

/**
 * @desc    Cancel an order (only if not completed)
 * @route   PUT /api/orders/:id/cancel
 * @access  Private
 */
const cancelOrder = catchAsync(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findOne({
    _id: id,
    user: req.user.id,
  });

  if (!order) {
    throw ApiError.notFound('Order not found');
  }

  // Cancel the order
  await order.cancel();

  res.status(200).json(
    successResponse({
      message: 'Order cancelled successfully',
      data: { order },
    })
  );
});

/**
 * @desc    Get order statistics for user
 * @route   GET /api/orders/stats/summary
 * @access  Private
 */
const getOrderStats = catchAsync(async (req, res) => {
  const stats = await Order.aggregate([
    { $match: { user: new require('mongoose').Types.ObjectId(req.user.id) } },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: '$total' },
        completedOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
        },
        cancelledOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] },
        },
      },
    },
  ]);

  const summary = stats[0] || {
    totalOrders: 0,
    totalSpent: 0,
    completedOrders: 0,
    cancelledOrders: 0,
  };

  res.status(200).json(
    successResponse({
      message: 'Order statistics retrieved successfully',
      data: { stats: summary },
    })
  );
});

module.exports = {
  checkout,
  getOrders,
  getOrder,
  cancelOrder,
  getOrderStats,
};
