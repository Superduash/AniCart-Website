/**
 * Auth Controller
 * 
 * Handles user authentication including registration, login, logout,
 * token refresh, and retrieving current user information.
 */

const User = require('../models/User');
const { generateTokens, verifyRefreshToken } = require('../utils/generateToken');
const { successResponse } = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');
const config = require('../config');
const CONSTANTS = require('../utils/constants');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw ApiError.conflict('Email already registered');
  }

  // Create new user
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
  });

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user);

  // Set refresh token as httpOnly cookie
  res.cookie(CONSTANTS.COOKIE.REFRESH_TOKEN_NAME, refreshToken, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: 'strict',
    maxAge: CONSTANTS.COOKIE.MAX_AGE_MS,
  });

  // Return success response with tokens and user data
  res.status(201).json(
    successResponse({
      message: 'User registered successfully',
      data: {
        user,
        accessToken,
      },
    })
  );
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email (include password for comparison)
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Compare password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user);

  // Set refresh token as httpOnly cookie
  res.cookie(CONSTANTS.COOKIE.REFRESH_TOKEN_NAME, refreshToken, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: 'strict',
    maxAge: CONSTANTS.COOKIE.MAX_AGE_MS,
  });

  // Get user without password
  const userResponse = await User.findById(user._id);

  // Return success response
  res.status(200).json(
    successResponse({
      message: 'Login successful',
      data: {
        user: userResponse,
        accessToken,
      },
    })
  );
});

/**
 * @desc    Logout user / clear refresh token cookie
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = catchAsync(async (req, res) => {
  // Clear refresh token cookie
  res.cookie(CONSTANTS.COOKIE.REFRESH_TOKEN_NAME, '', {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: 'strict',
    expires: new Date(0),
  });

  res.status(200).json(
    successResponse({
      message: 'Logout successful',
    })
  );
});

/**
 * @desc    Get current logged-in user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = catchAsync(async (req, res) => {
  // User is already attached to req by auth middleware
  const user = await User.findById(req.user.id);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  res.status(200).json(
    successResponse({
      message: 'User retrieved successfully',
      data: { user },
    })
  );
});

/**
 * @desc    Refresh access token using refresh token
 * @route   POST /api/auth/refresh
 * @access  Public (requires valid refresh token cookie)
 */
const refreshToken = catchAsync(async (req, res) => {
  // Get refresh token from cookie
  const refreshToken = req.cookies[CONSTANTS.COOKIE.REFRESH_TOKEN_NAME];

  if (!refreshToken) {
    throw ApiError.unauthorized('Refresh token not found');
  }

  try {
    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    // Generate new tokens
    const tokens = generateTokens(user);

    // Set new refresh token as httpOnly cookie
    res.cookie(CONSTANTS.COOKIE.REFRESH_TOKEN_NAME, tokens.refreshToken, {
      httpOnly: true,
      secure: config.isProduction,
      sameSite: 'strict',
      maxAge: CONSTANTS.COOKIE.MAX_AGE_MS,
    });

    // Return new access token
    res.status(200).json(
      successResponse({
        message: 'Token refreshed successfully',
        data: {
          accessToken: tokens.accessToken,
        },
      })
    );
  } catch (error) {
    // Clear invalid refresh token cookie
    res.cookie(CONSTANTS.COOKIE.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      secure: config.isProduction,
      sameSite: 'strict',
      expires: new Date(0),
    });

    throw ApiError.unauthorized('Invalid refresh token');
  }
});

module.exports = {
  register,
  login,
  logout,
  getMe,
  refreshToken,
};
