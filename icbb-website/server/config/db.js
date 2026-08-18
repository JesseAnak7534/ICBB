const mongoose = require('mongoose');

/**
 * Connection handling that works both for a long-running process and for
 * serverless functions.
 *
 * On a serverless host the module is kept warm between invocations but the
 * handler runs many times, so we cache the connection promise on `global` and
 * reuse it. Without this, every request opens a new pool and the Atlas
 * connection limit is exhausted within minutes.
 */

let cached = global.__mongooseConn;

if (!cached) {
  cached = global.__mongooseConn = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/icbb_db';

  if (!cached.promise) {
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      // Let the next request rebuild the connection.
      cached.conn = null;
      cached.promise = null;
    });

    cached.promise = mongoose
      .connect(mongoURI, {
        // Fail fast instead of hanging the request for 30s when Atlas is
        // unreachable or the IP is not allowlisted.
        serverSelectionTimeoutMS: 10000,
        maxPoolSize: 10
      })
      .then((mongooseInstance) => {
        console.log(`MongoDB Connected: ${mongooseInstance.connection.host}`);
        return mongooseInstance.connection;
      })
      .catch((error) => {
        // Clear the cached promise so a later request can retry rather than
        // permanently reusing a rejected promise.
        cached.promise = null;
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

// Close cleanly when running as a normal process. Serverless hosts freeze the
// process instead of signalling it, so this is a no-op there.
process.on('SIGINT', async () => {
  if (cached.conn) {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
  }
  process.exit(0);
});

module.exports = connectDB;
