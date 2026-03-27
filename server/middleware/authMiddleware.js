/**
 * Authentication Middleware
 * 
 * Verifies JWT tokens from Authorization header and attaches user info to request.
 * Also provides role-based access control for admin routes.
 */

const { verifyAccessToken } = require('../utils/generateToken');
const ApiError = require('../utils/apiError');
const User = require('../models/User');

/**
 * Middleware to verify JWT access token
 * Attaches req.user with { id, email, role } if token is valid
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return next(ApiError.unauthorized('Access denied. No token provided.'));
    }

    try {
      // Verify token
      const decoded = verifyAccessToken(token);

      // Verify user still exists
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return next(ApiError.unauthorized('User not found. Token is invalid.'));
      }

      // Attach user info to request object
      req.user = {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return next(ApiError.unauthorized('Token has expired. Please login again.'));
      }
      if (error.name === 'JsonWebTokenError') {
        return next(ApiError.unauthorized('Invalid token.'));
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to restrict access to admin users only
 * Must be used after protect middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const adminOnly = (req, res, next) => {
  // Check if user exists (protect middleware should run first)
  if (!req.user) {
    return next(ApiError.unauthorized('Authentication required'));
  }

  // Check if user has admin role
  if (req.user.role !== 'admin') {
    return next(ApiError.forbidden('Admin access required'));
  }

  next();
};

/**
 * Middleware to allow access to either the user themselves or an admin
 * For routes where users can access their own resources
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const ownerOrAdmin = (req, res, next) => {
  // Check if user exists (protect middleware should run first)
  if (!req.user) {
    return next(ApiError.unauthorized('Authentication required'));
  }

  // Allow if admin or if user is accessing their own resource
  const resourceUserId = req.params.userId || req.body.userId;
  
  if (req.user.role === 'admin' || req.user.id === resourceUserId) {
    return next();
  }

  next(ApiError.forbidden('You can only access your own resources'));
};

module.exports = {
  protect,
  adminOnly,
  ownerOrAdmin,
};
