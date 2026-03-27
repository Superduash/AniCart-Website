/**
 * Product Controller
 * 
 * Handles product operations including listing, retrieving single product,
 * creating, updating, and soft-deleting products (admin only).
 */

const Product = require('../models/Product');
const { successResponse, paginatedResponse } = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');
const CONSTANTS = require('../utils/constants');

/**
 * @desc    Get all products with optional filtering and pagination
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = catchAsync(async (req, res) => {
  const { series, page = 1, limit = CONSTANTS.DEFAULTS.PAGE_LIMIT, search } = req.query;

  // Build query filter
  const filter = { isActive: true };

  // Filter by series if provided
  if (series) {
    filter.series = series;
  }

  // Search by name if provided
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  // Parse pagination parameters
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(
    CONSTANTS.LIMITS.MAX_PAGE_SIZE,
    Math.max(1, parseInt(limit, 10))
  );
  const skip = (pageNum - 1) * limitNum;

  // Execute query with pagination
  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Product.countDocuments(filter),
  ]);

  // Get distinct series for filters
  const distinctSeries = await Product.getDistinctSeries();

  res.status(200).json(
    paginatedResponse({
      message: 'Products retrieved successfully',
      data: products,
      page: pageNum,
      limit: limitNum,
      total,
      meta: {
        filters: {
          series: distinctSeries,
        },
      },
    })
  );
});

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProduct = catchAsync(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findOne({ _id: id, isActive: true });

  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  res.status(200).json(
    successResponse({
      message: 'Product retrieved successfully',
      data: { product },
    })
  );
});

/**
 * @desc    Create new product (Admin only)
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = catchAsync(async (req, res) => {
  const {
    name,
    series,
    price,
    img,
    badge,
    badgeType,
    rating,
    reviews,
    resolution,
    tags,
  } = req.body;

  // Create product
  const product = await Product.create({
    name: name.trim(),
    series: series.trim(),
    price,
    img: img.trim(),
    badge: badge || '',
    badgeType: badgeType || '',
    rating: rating || 0,
    reviews: reviews || 0,
    resolution: resolution || '4K Ultra HD',
    tags: tags || [],
  });

  res.status(201).json(
    successResponse({
      message: 'Product created successfully',
      data: { product },
    })
  );
});

/**
 * @desc    Update product (Admin only)
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    series,
    price,
    img,
    badge,
    badgeType,
    rating,
    reviews,
    resolution,
    tags,
    isActive,
  } = req.body;

  // Find product
  const product = await Product.findById(id);
  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  // Update fields if provided
  if (name !== undefined) product.name = name.trim();
  if (series !== undefined) product.series = series.trim();
  if (price !== undefined) product.price = price;
  if (img !== undefined) product.img = img.trim();
  if (badge !== undefined) product.badge = badge;
  if (badgeType !== undefined) product.badgeType = badgeType;
  if (rating !== undefined) product.rating = rating;
  if (reviews !== undefined) product.reviews = reviews;
  if (resolution !== undefined) product.resolution = resolution;
  if (tags !== undefined) product.tags = tags;
  if (isActive !== undefined) product.isActive = isActive;

  // Save updated product
  await product.save();

  res.status(200).json(
    successResponse({
      message: 'Product updated successfully',
      data: { product },
    })
  );
});

/**
 * @desc    Soft delete product (Admin only)
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Find product
  const product = await Product.findById(id);
  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  // Soft delete (set isActive to false)
  await product.softDelete();

  res.status(200).json(
    successResponse({
      message: 'Product deleted successfully',
    })
  );
});

/**
 * @desc    Get all product series (for filters)
 * @route   GET /api/products/series/list
 * @access  Public
 */
const getSeries = catchAsync(async (req, res) => {
  const series = await Product.getDistinctSeries();

  res.status(200).json(
    successResponse({
      message: 'Series retrieved successfully',
      data: { series },
    })
  );
});

/**
 * @desc    Restore soft-deleted product (Admin only)
 * @route   PUT /api/products/:id/restore
 * @access  Private/Admin
 */
const restoreProduct = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Find product
  const product = await Product.findById(id);
  if (!product) {
    throw ApiError.notFound('Product not found');
  }

  // Restore product
  await product.restore();

  res.status(200).json(
    successResponse({
      message: 'Product restored successfully',
      data: { product },
    })
  );
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getSeries,
  restoreProduct,
};
