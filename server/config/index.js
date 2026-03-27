/**
 * Configuration Module
 * 
 * Centralizes all environment variables and configuration settings.
 * Provides default values and validates required configurations.
 */

require('dotenv').config();

const config = {
  // Server configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  
  // Database configuration
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/AniCartAi',
  
  // JWT configuration
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || '15m',
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d',
  
  // Client configuration
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  
  // Security configuration
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12,
  
  // Helper properties
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

// Validate required configurations
const requiredConfigs = ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];

requiredConfigs.forEach((key) => {
  if (!config[key]) {
    console.error(`FATAL ERROR: ${key} is not defined in environment variables`);
    process.exit(1);
  }
});

module.exports = config;
