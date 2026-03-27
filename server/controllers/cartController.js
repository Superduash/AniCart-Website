/**
 * Cart Controller
 * 
 * Handles cart operations including retrieving cart, adding items,
 * updating quantities, removing items, and clearing the cart.
 */

const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { successResponse } = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');

/**
 * @desc    Get user's cart with populated product details
 * @route   GET /api/cart
 * @access  Private
 */
const getCart = catchAsync(async (req, res) => {
  // Find or create cart for user
  let cart = await Cart.findOne({ user: req.user.id }).populate({
    path: 'items.product',
    select: '-__v',
  });

  if (!cart) {
    // Create empty cart if doesn't exist
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  // Calculate totals
  const itemCount = cart.items.reduce((total, item) => total + item.qty, 0);
  const totalPrice = cart.items.reduce((total, item) => {
    const price = item.product?.price || 0;
    return total + price * item.qty;
  }, 0);

  res.status(200).json(
    successResponse({
      message: 'Cart retrieved successfully',
      data: {
        cart,
        summary: {
          itemCount,
          totalPrice: parseFloat(totalPrice.toFixed(2)),
        },
      },
    })
  );
});

/**
 * @desc    Add product to cart
 * @route   POST /api/cart/add
 * @access  Private
 */
const addToCart = catchAsync(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  // Verify product exists and is active
  const product = await Product.findOne({ _id: productId, isActive: true });
  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  // Find or create cart
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  // Add item to cart
  await cart.addItem(productId, parseInt(quantity, 10));

  // Get updated cart with populated products
  const updatedCart = await Cart.findById(cart._id).populate({
    path: 'items.product',
    select: '-__v',
  });

  // Calculate totals
  const itemCount = updatedCart.items.reduce((total, item) => total + item.qty, 0);
  const totalPrice = updatedCart.items.reduce((total, item) => {
    const price = item.product?.price || 0;
    return total + price * item.qty;
  }, 0);

  res.status(200).json(
    successResponse({
      message: 'Item added to cart',
      data: {
        cart: updatedCart,
        summary: {
          itemCount,
          totalPrice: parseFloat(totalPrice.toFixed(2)),
        },
      },
    })
  );
});

/**
 * @desc    Update item quantity in cart
 * @route   PUT /api/cart/update
 * @access  Private
 */
const updateCartItem = catchAsync(async (req, res) => {
  const { productId, quantity } = req.body;

  // Find cart
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    throw ApiError.notFound('Cart not found');
  }

  // Update item quantity
  await cart.updateItemQuantity(productId, parseInt(quantity, 10));

  // Get updated cart with populated products
  const updatedCart = await Cart.findById(cart._id).populate({
    path: 'items.product',
    select: '-__v',
  });

  // Calculate totals
  const itemCount = updatedCart.items.reduce((total, item) => total + item.qty, 0);
  const totalPrice = updatedCart.items.reduce((total, item) => {
    const price = item.product?.price || 0;
    return total + price * item.qty;
  }, 0);

  res.status(200).json(
    successResponse({
      message: 'Cart updated successfully',
      data: {
        cart: updatedCart,
        summary: {
          itemCount,
          totalPrice: parseFloat(totalPrice.toFixed(2)),
        },
      },
    })
  );
});

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/remove/:productId
 * @access  Private
 */
const removeFromCart = catchAsync(async (req, res) => {
  const { productId } = req.params;

  // Find cart
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    throw ApiError.notFound('Cart not found');
  }

  // Remove item from cart
  await cart.removeItem(productId);

  // Get updated cart with populated products
  const updatedCart = await Cart.findById(cart._id).populate({
    path: 'items.product',
    select: '-__v',
  });

  // Calculate totals
  const itemCount = updatedCart.items.reduce((total, item) => total + item.qty, 0);
  const totalPrice = updatedCart.items.reduce((total, item) => {
    const price = item.product?.price || 0;
    return total + price * item.qty;
  }, 0);

  res.status(200).json(
    successResponse({
      message: 'Item removed from cart',
      data: {
        cart: updatedCart,
        summary: {
          itemCount,
          totalPrice: parseFloat(totalPrice.toFixed(2)),
        },
      },
    })
  );
});

/**
 * @desc    Clear entire cart
 * @route   DELETE /api/cart/clear
 * @access  Private
 */
const clearCart = catchAsync(async (req, res) => {
  // Find cart
  const cart = await Cart.findOne({ user: req.user.id });
  
  if (cart) {
    await cart.clearCart();
  }

  res.status(200).json(
    successResponse({
      message: 'Cart cleared successfully',
      data: {
        cart: {
          items: [],
          itemCount: 0,
          totalPrice: 0,
        },
      },
    })
  );
});

/**
 * @desc    Sync cart with client-side cart (for initial load)
 * @route   POST /api/cart/sync
 * @access  Private
 */
const syncCart = catchAsync(async (req, res) => {
  const { items } = req.body; // Array of { productId, quantity }

  // Find or create cart
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  // Validate and filter items
  if (items && Array.isArray(items) && items.length > 0) {
    // Get valid product IDs
    const productIds = items.map((item) => item.productId);
    const validProducts = await Product.find({
      _id: { $in: productIds },
      isActive: true,
    }).select('_id');

    const validProductIds = validProducts.map((p) => p._id.toString());

    // Filter valid items and merge with existing cart
    const validItems = items.filter((item) =>
      validProductIds.includes(item.productId)
    );

    // Clear existing items and add new ones
    cart.items = [];
    for (const item of validItems) {
      cart.items.push({
        product: item.productId,
        qty: Math.max(1, parseInt(item.quantity, 10) || 1),
      });
    }

    await cart.save();
  }

  // Get updated cart with populated products
  const updatedCart = await Cart.findById(cart._id).populate({
    path: 'items.product',
    select: '-__v',
  });

  // Calculate totals
  const itemCount = updatedCart.items.reduce((total, item) => total + item.qty, 0);
  const totalPrice = updatedCart.items.reduce((total, item) => {
    const price = item.product?.price || 0;
    return total + price * item.qty;
  }, 0);

  res.status(200).json(
    successResponse({
      message: 'Cart synced successfully',
      data: {
        cart: updatedCart,
        summary: {
          itemCount,
          totalPrice: parseFloat(totalPrice.toFixed(2)),
        },
      },
    })
  );
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  syncCart,
};
