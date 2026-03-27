/**
 * Product Model
 * 
 * Defines the schema for anime wallpaper products including
 * metadata like series, pricing, badges, ratings, and tags.
 */

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    series: {
      type: String,
      required: [true, 'Series is required'],
      trim: true,
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    badge: {
      type: String,
      trim: true,
      enum: ['HOT', 'NEW', 'BESTSELLER', 'CLASSIC', 'PREMIUM', ''],
      default: '',
    },
    badgeType: {
      type: String,
      enum: ['neon', 'pink', ''],
      default: '',
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot exceed 5'],
    },
    reviews: {
      type: Number,
      default: 0,
      min: [0, 'Reviews count cannot be negative'],
    },
    img: {
      type: String,
      required: [true, 'Product image URL is required'],
      trim: true,
    },
    resolution: {
      type: String,
      trim: true,
      default: '4K Ultra HD',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    // Transform output to map _id to id and remove __v
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Index frequently queried fields
productSchema.index({ isActive: 1 });
productSchema.index({ tags: 1 });

/**
 * Static method to get distinct series for filtering
 * @returns {Promise<Array>} - Array of unique series names
 */
productSchema.statics.getDistinctSeries = async function () {
  return await this.distinct('series', { isActive: true });
};

/**
 * Instance method to soft delete product
 */
productSchema.methods.softDelete = async function () {
  this.isActive = false;
  return await this.save();
};

/**
 * Instance method to restore soft deleted product
 */
productSchema.methods.restore = async function () {
  this.isActive = true;
  return await this.save();
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
