/**
 * Long-running server entrypoint (local development, Render, Railway, Fly).
 *
 * The Express app itself lives in `app.js` so that serverless entrypoints can
 * import it without starting a listener. See `../api/index.js`.
 */
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ICBB API Server                                         ║
║   Institute of Computational Biology & Bioinformatics     ║
║                                                           ║
║   Listening on port ${PORT}
║   Environment: ${process.env.NODE_ENV || 'development'}
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  });

module.exports = app;
