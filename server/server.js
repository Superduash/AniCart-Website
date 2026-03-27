/**
 * AniCartAi Server
 * 
 * Main entry point for the Express.js backend application.
 * Configures middleware, routes, database connection, and starts the server.
 */

const originalEmitWarning = process.emitWarning;
process.emitWarning = (warning, ...args) => {
  const warningMessage = typeof warning === 'string' ? warning : warning?.message || '';
  const warningType = typeof warning === 'object' ? warning?.name : args[0];
  const warningCode = typeof warning === 'object' ? warning?.code : args[1];

  const isUrlParseDeprecation =
    warningCode === 'DEP0169' ||
    (warningType === 'DeprecationWarning' && warningMessage.includes('url.parse()'));

  if (isUrlParseDeprecation) {
    return;
  }

  return originalEmitWarning.call(process, warning, ...args);
};

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// Load environment variables
require('dotenv').config();

// Import configuration
const config = require('./config');

const connectDB = require("./db/connect");
connectDB();

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routers/authRoutes');
const userRoutes = require('./routers/userRoutes');
const productRoutes = require('./routers/productRoutes');
const cartRoutes = require('./routers/cartRoutes');
const orderRoutes = require('./routers/orderRoutes');

// Initialize Express app
const app = express();

// ============================================
// Middleware Configuration
// ============================================

// Security headers with Helmet
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: config.CLIENT_URL,
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Request logging
app.use(morgan(config.isDevelopment ? 'dev' : 'combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parsing middleware
app.use(cookieParser());

// ============================================
// Health Check Route
// ============================================

/**
 * @route   GET /api/health
 * @desc    Health check endpoint
 * @access  Public
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
  });
});

// ============================================
// API Routes
// ============================================

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// ============================================
// Error Handling
// ============================================

// Handle 404 - Route not found
app.use(notFound);

// Global error handler
app.use(errorHandler);

// ============================================
// Server Startup
// ============================================

/**
 * Start the server
 */
const startServer = () => {
  try {
    const initialPort = Number(config.PORT) || 5000;

    const listenWithFallback = (port) => {
      const server = app
        .listen(port, () => {
      console.log(`
=================================
🚀 AniCartAi Server Started
=================================
🌍 Environment : ${process.env.NODE_ENV || 'development'}
🖥️  Port        : ${port}
🔗 API URL     : http://localhost:${port}/api
💻 Client URL  : http://localhost:3000
=================================
`);
        })
        .on('error', (error) => {
          if (error.code === 'EADDRINUSE') {
            const nextPort = port + 1;
            console.warn(`Port ${port} is busy. Retrying on ${nextPort}...`);
            listenWithFallback(nextPort);
            return;
          }

          console.error('Failed to start server:', error.message);
          process.exit(1);
        });

      return server;
    };

    listenWithFallback(initialPort);
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Start the server
startServer();

module.exports = app;
