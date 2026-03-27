/**
 * Database Connection Module
 * 
 * This module establishes and manages the MongoDB connection using Mongoose.
 * It includes retry logic, connection pooling, and graceful shutdown handling.
 */

const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Connection pooling - use default pool size
      maxPoolSize: 10,
      // Retry logic
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

/**
 * Graceful shutdown - close database connection
 * @returns {Promise<void>}
 */
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  } catch (error) {
    console.error(`Error closing MongoDB connection: ${error.message}`);
    process.exit(1);
  }
};

// Handle graceful shutdown on process termination
process.on('SIGINT', async () => {
  console.log('\nSIGINT received. Closing MongoDB connection...');
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nSIGTERM received. Closing MongoDB connection...');
  await disconnectDB();
  process.exit(0);
});

module.exports = { connectDB, disconnectDB };
