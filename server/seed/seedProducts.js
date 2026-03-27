/**
 * Seed Script
 * 
 * Seeds the database with initial products and a default admin user.
 * Run with: npm run seed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Import models
const Product = require('../models/Product');
const User = require('../models/User');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/AniCartAi';

// Sample products data matching the frontend
const productsData = [
  {
    name: 'Itadori Yuji — Cursed Pulse',
    series: 'Jujutsu Kaisen',
    price: 4.99,
    badge: 'HOT',
    badgeType: 'neon',
    rating: 4.9,
    reviews: 234,
    img: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=300&fit=crop',
    resolution: '4K Ultra HD',
    tags: ['Action', 'Dark Fantasy'],
  },
  {
    name: "Mikasa Ackerman — Titan's Edge",
    series: 'Attack on Titan',
    price: 3.99,
    badge: 'NEW',
    badgeType: 'pink',
    rating: 4.8,
    reviews: 189,
    img: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop',
    resolution: '4K Ultra HD',
    tags: ['Action', 'Post-Apocalyptic'],
  },
  {
    name: 'Nezuko — Bamboo Blossom',
    series: 'Demon Slayer',
    price: 5.99,
    badge: 'BESTSELLER',
    badgeType: 'neon',
    rating: 5.0,
    reviews: 412,
    img: 'https://images.unsplash.com/photo-1492576540313-31ad3a64ba5e?w=400&h=300&fit=crop',
    resolution: '4K Ultra HD',
    tags: ['Fantasy', 'Adventure'],
  },
  {
    name: 'Naruto — Nine-Tails Awakening',
    series: 'Naruto Shippuden',
    price: 3.49,
    badge: 'CLASSIC',
    badgeType: 'neon',
    rating: 4.7,
    reviews: 567,
    img: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop',
    resolution: '2K HD',
    tags: ['Action', 'Ninja'],
  },
  {
    name: 'Gojo Satoru — Infinity Veil',
    series: 'Jujutsu Kaisen',
    price: 6.99,
    badge: 'PREMIUM',
    badgeType: 'pink',
    rating: 4.9,
    reviews: 321,
    img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=300&fit=crop',
    resolution: '4K Ultra HD',
    tags: ['Action', 'Supernatural'],
  },
  {
    name: 'Levi Ackerman — Thunder Spear',
    series: 'Attack on Titan',
    price: 4.49,
    badge: 'NEW',
    badgeType: 'neon',
    rating: 4.8,
    reviews: 276,
    img: 'https://images.unsplash.com/photo-1547636780-9b865e394b50?w=400&h=300&fit=crop',
    resolution: '4K Ultra HD',
    tags: ['Action', 'Drama'],
  },
  {
    name: 'Luffy — Gear Fifth',
    series: 'One Piece',
    price: 5.49,
    badge: 'HOT',
    badgeType: 'pink',
    rating: 4.9,
    reviews: 398,
    img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=300&fit=crop',
    resolution: '4K Ultra HD',
    tags: ['Adventure', 'Comedy'],
  },
  {
    name: 'Zoro — Asura Phantom',
    series: 'One Piece',
    price: 4.99,
    badge: 'CLASSIC',
    badgeType: 'neon',
    rating: 4.7,
    reviews: 245,
    img: 'https://images.unsplash.com/photo-1580130732478-4e339fb33746?w=400&h=300&fit=crop',
    resolution: '2K HD',
    tags: ['Action', 'Adventure'],
  },
];

// Default admin user
const adminUser = {
  name: 'Admin',
  email: 'admin@anicart.com',
  password: 'Admin@1234',
  role: 'admin',
};

/**
 * Connect to MongoDB
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Seed products to database
 */
const seedProducts = async () => {
  try {
    console.log('\n--- Seeding Products ---');
    
    // Delete existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    const createdProducts = await Product.insertMany(productsData);
    console.log(`Created ${createdProducts.length} products`);

    // Log created products
    createdProducts.forEach((product) => {
      console.log(`  - ${product.name} (${product.series}) - $${product.price}`);
    });

    return createdProducts;
  } catch (error) {
    console.error('Error seeding products:', error.message);
    throw error;
  }
};

/**
 * Seed admin user to database
 */
const seedAdminUser = async () => {
  try {
    console.log('\n--- Seeding Admin User ---');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminUser.email });
    if (existingAdmin) {
      console.log('Admin user already exists, skipping...');
      return existingAdmin;
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12;
    const hashedPassword = await bcrypt.hash(adminUser.password, saltRounds);

    // Create admin user
    const createdAdmin = await User.create({
      ...adminUser,
      password: hashedPassword,
      avatar: adminUser.name.charAt(0).toUpperCase(),
    });

    console.log('Admin user created successfully:');
    console.log(`  - Name: ${createdAdmin.name}`);
    console.log(`  - Email: ${createdAdmin.email}`);
    console.log(`  - Role: ${createdAdmin.role}`);

    return createdAdmin;
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
    throw error;
  }
};

/**
 * Main seed function
 */
const seedDatabase = async () => {
  try {
    console.log('=================================');
    console.log('  AniCartAi Database Seeder');
    console.log('=================================\n');

    // Connect to database
    await connectDB();

    // Seed products
    await seedProducts();

    // Seed admin user
    await seedAdminUser();

    console.log('\n=================================');
    console.log('  Seeding completed successfully!');
    console.log('=================================\n');

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('\n=================================');
    console.error('  Seeding failed!');
    console.error('=================================');
    console.error('Error:', error.message);

    // Close connection if open
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
