const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const env = require('./config/env');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.set('query parser', 'extended');

// Security HTTP headers
app.use(helmet());

// Cross-Origin Resource Sharing (CORS) with explicit origins
const allowedOrigins = [
  env.clientUrl,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman) or listed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key'],
  })
);

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // max 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP address, please try again after 15 minutes',
  },
});
app.use(globalLimiter);

// Body parser
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Health Check Endpoint
app.get('/api/v1/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  const status = isDbConnected ? 'UP' : 'DEGRADED';
  const httpCode = isDbConnected ? 200 : 503;

  res.status(httpCode).json({
    success: isDbConnected,
    message: isDbConnected ? 'Hotel New Moorthi Cafe API is healthy and operational' : 'Database connection unavailable',
    data: {
      status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: env.nodeEnv,
      database: isDbConnected ? 'CONNECTED' : 'DISCONNECTED',
      timezone: env.businessTimezone,
    },
  });
});

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Hotel New Moorthi Cafe API (Chidambaram)',
    version: '1.0.0',
    documentation: '/docs',
    health: '/api/v1/health',
  });
});

// Route registration will be attached here
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/categories', require('./routes/categoryRoutes'));
app.use('/api/v1/foods', require('./routes/foodRoutes'));
app.use('/api/v1/orders', require('./routes/orderRoutes'));
app.use('/api/v1/admin', require('./routes/adminRoutes'));

// 404 and Error Handler
app.use(notFound);
app.use(errorHandler);

module.exports = app;
