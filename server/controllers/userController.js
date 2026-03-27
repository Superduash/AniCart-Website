/**
 * User Controller
 * 
 * Handles user profile operations including retrieving profile,
 * updating profile information, and changing passwords.
 */

const User = require('../models/User');
const { successResponse } = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getProfile = catchAsync(async (req, res) => {
  // Get user with populated library
  const user = await User.findById(req.user.id)
    .populate('library', '-__v');

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  res.status(200).json(
    successResponse({
      message: 'Profile retrieved successfully',
      data: { user },
    })
  );
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = catchAsync(async (req, res) => {
  const { name } = req.body;

  // Find user
  const user = await User.findById(req.user.id);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  // Update fields if provided
  if (name) {
    user.name = name.trim();
    // Update avatar based on new name
    user.avatar = user.name.charAt(0).toUpperCase();
  }

  // Save updated user
  await user.save();

  res.status(200).json(
    successResponse({
      message: 'Profile updated successfully',
      data: { user },
    })
  );
});

/**
 * @desc    Change user password
 * @route   PUT /api/users/password
 * @access  Private
 */
const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Find user with password
  const user = await User.findById(req.user.id).select('+password');
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  // Verify current password
  const isPasswordValid = await user.comparePassword(currentPassword);
  if (!isPasswordValid) {
    throw ApiError.badRequest('Current password is incorrect');
  }

  // Update password (will be hashed by pre-save middleware)
  user.password = newPassword;
  await user.save();

  res.status(200).json(
    successResponse({
      message: 'Password changed successfully',
    })
  );
});

/**
 * @desc    Get user's library (purchased wallpapers)
 * @route   GET /api/users/library
 * @access  Private
 */
const getLibrary = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate('library', '-__v')
    .select('library');

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  res.status(200).json(
    successResponse({
      message: 'Library retrieved successfully',
      data: { library: user.library },
    })
  );
});

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getLibrary,
};
