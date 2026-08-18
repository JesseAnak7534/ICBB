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
