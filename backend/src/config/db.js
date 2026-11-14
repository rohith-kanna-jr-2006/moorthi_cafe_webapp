const mongoose = require('mongoose');
const env = require('./env');

// Import all models to ensure schemas with indexes are loaded
const User = require('../models/User');
const Category = require('../models/Category');
const Food = require('../models/Food');
const Order = require('../models/Order');
const DailyCounter = require('../models/DailyCounter');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.mongodbUri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: env.nodeEnv === 'development',
    });

    // For staging: explicitly create schema-defined indexes
    // Production must not automatically create or synchronize indexes
    if (env.nodeEnv === 'staging') {
      const models = [User, Category, Food, Order, DailyCounter];
      for (const model of models) {
        await model.createIndexes();
        console.log(`[Database] Indexes ensured: ${model.modelName}`);
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
