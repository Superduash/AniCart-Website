/**
 * Auth Routes
 * 
 * Defines routes for authentication endpoints including registration,
 * login, logout, token refresh, and current user retrieval.
 */

const express = require('express');
const router = express.Router();

// Import controller functions
const {
  register,
  login,
  logout,
  getMe,
  refreshToken,
} = require('../controllers/authController');

// Import middleware
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');
const {
  registerValidation,
  loginValidation,
} = require('../middleware/validateRequest');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authLimiter, registerValidation, register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', authLimiter, loginValidation, login);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user and clear refresh token
 * @access  Private
 */
router.post('/logout', protect, logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user
 * @access  Private
 */
router.get('/me', protect, getMe);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public (requires valid refresh token cookie)
 */
router.post('/refresh', refreshToken);

module.exports = router;
