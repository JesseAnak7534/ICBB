/**
 * Vercel serverless entrypoint.
 *
 * `vercel.json` rewrites every /api/* request here, and the Express app does its
 * own routing from there. The database connection is established before the
 * request is handed over, and `connectDB` caches it across warm invocations.
 */
const app = require('../server/app');
const connectDB = require('../server/config/db');

module.exports = async (req, res) => {
  // Answer the health check before touching the database, so that "the function
  // is alive" can be told apart from "the database is unreachable". Without
  // this, a missing MONGODB_URI makes every route look identical.
  if (req.url === '/api/health' || req.url === '/health') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      status: 'ok',
      message: 'ICBB API is running',
      database: process.env.MONGODB_URI ? 'configured' : 'not configured',
      timestamp: new Date().toISOString()
    }));
    return;
  }

  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection failed:', error.message);
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      success: false,
      message: 'Service temporarily unavailable. Please try again shortly.'
    }));
    return;
  }

  return app(req, res);
};
