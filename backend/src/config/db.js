const mongoose = require('mongoose');
const env = require('./env');

// Import all models to ensure schemas with indexes are loaded
require('../models/User');
require('../models/Category');
require('../models/Food');
require('../models/Order');
require('../models/DailyCounter');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.mongodbUri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: env.nodeEnv !== 'production',
    });

    // Explicitly sync indexes in non-production environments.
    // autoIndex only creates indexes when documents are first inserted,
    // but if no documents exist yet, indexes are never created.
    // syncIndexes ensures all schema-defined indexes exist immediately.
    if (env.nodeEnv !== 'production') {
      try {
        await Promise.allSettled([
          require('../models/User').syncIndexes(),
          require('../models/Category').syncIndexes(),
          require('../models/Food').syncIndexes(),
          require('../models/Order').syncIndexes(),
          require('../models/DailyCounter').syncIndexes(),
        ]);
      } catch (indexError) {
        // Log but don't block - indexes may already exist or disk is full
        console.warn('[Database] Index sync skipped:', indexError.message);
      }
    }

    console.log(`[Database] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    throw error;
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[Database] MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error(`[Database Error] Runtime issue: ${err.message}`);
});

module.exports = { connectDB, mongoose };
