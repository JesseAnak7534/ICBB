const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const { corsOrigins, isProduction } = require('./config/env');

// Import routes
const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const paymentRoutes = require('./routes/payments');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');
const trainingRoutes = require('./routes/training');
const participantRoutes = require('./routes/participants');

const app = express();

// Trust proxy for rate limiting (important when behind a reverse proxy/CDN)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// A tighter limit on login so the admin password cannot be brute-forced.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again later.'
});
app.use('/api/auth/login', authLimiter);

// CORS — only the origins we actually serve.
app.use(cors({
  origin(origin, callback) {
    // Requests with no Origin header (curl, server-to-server, health checks)
    // are not browser cross-origin requests, so there is nothing to protect.
    if (!origin) return callback(null, true);
    if (corsOrigins.includes(origin)) return callback(null, true);

    // Allow Vercel preview deployments of this project.
    if (/^https:\/\/icbb[a-z0-9-]*\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }

    // Give the error a status so it surfaces as a clean 403 rather than a 500
    // with a stack trace.
    const error = new Error('Not allowed by CORS');
    error.status = 403;
    return callback(error);
  },
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploads (local/dev only — serverless hosts have no
// persistent disk, where uploads are served from blob storage instead).
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/participants', participantRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ICBB API Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler — must come after all routes but before the error handler.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware — must be last, and must keep all four arguments
// for Express to recognise it as an error handler.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(!isProduction && { stack: err.stack })
  });
});

module.exports = app;
