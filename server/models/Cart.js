/**
 * Cart Model
 * 
 * Defines the schema for user shopping carts stored in the database.
 * Each user has one cart with multiple items referencing products.
 */

const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required'],
    },
    qty: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      default: 1,
    },
  },
  {
    _id: false, // Don't create separate _id for subdocuments
  }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true, // One cart per user
      index: true,
    },
    items: [cartItemSchema],
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

// Index for faster user lookups
// Note: user is already indexed due to unique: true

/**
 * Virtual to calculate total items count
 */
cartSchema.virtual('itemCount').get(function () {
  return this.items.reduce((total, item) => total + item.qty, 0);
});

/**
 * Virtual to calculate total price
 * Note: This requires populated product data
 */
cartSchema.virtual('totalPrice').get(function () {
  return this.items.reduce((total, item) => {
    const price = item.product?.price || 0;
    return total + price * item.qty;
  }, 0);
});

/**
 * Static method to find or create cart for a user
 * @param {string} userId - The user ID
 * @returns {Promise<Document>} - The cart document
 */
cartSchema.statics.findOrCreate = async function (userId) {
  let cart = await this.findOne({ user: userId });
  if (!cart) {
    cart = await this.create({ user: userId, items: [] });
  }
  return cart;
};

/**
 * Instance method to add item to cart
 * @param {string} productId - The product ID to add
 * @param {number} quantity - The quantity to add
 * @returns {Promise<Document>} - The updated cart
 */
cartSchema.methods.addItem = async function (productId, quantity = 1) {
  const existingItem = this.items.find(
    (item) => item.product.toString() === productId.toString()
  );

  if (existingItem) {
    existingItem.qty += quantity;
  } else {
    this.items.push({ product: productId, qty: quantity });
  }

  return await this.save();
};

/**
 * Instance method to update item quantity
 * @param {string} productId - The product ID to update
 * @param {number} quantity - The new quantity
 * @returns {Promise<Document>} - The updated cart
 */
cartSchema.methods.updateItemQuantity = async function (productId, quantity) {
  const item = this.items.find(
    (item) => item.product.toString() === productId.toString()
  );

  if (!item) {
    throw new Error('Item not found in cart');
  }

  if (quantity <= 0) {
    // Remove item if quantity is 0 or less
    this.items = this.items.filter(
      (item) => item.product.toString() !== productId.toString()
    );
  } else {
    item.qty = quantity;
  }

  return await this.save();
};

/**
 * Instance method to remove item from cart
 * @param {string} productId - The product ID to remove
 * @returns {Promise<Document>} - The updated cart
 */
cartSchema.methods.removeItem = async function (productId) {
  this.items = this.items.filter(
    (item) => item.product.toString() !== productId.toString()
  );
  return await this.save();
};

/**
 * Instance method to clear cart
 * @returns {Promise<Document>} - The cleared cart
 */
cartSchema.methods.clearCart = async function () {
  this.items = [];
  return await this.save();
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
