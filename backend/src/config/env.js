const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const requiredVars = ['PORT', 'MONGODB_URI', 'JWT_SECRET'];

for (const key of requiredVars) {
  if (!process.env[key]) {
    throw new Error(`[Config Error] Missing required environment variable: ${key}`);
  }
}

if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET.length < 32) {
  throw new Error('[Security Error] JWT_SECRET must be at least 32 characters in production');
}

const env = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  businessTimezone: process.env.BUSINESS_TIMEZONE || 'Asia/Kolkata',
  businessOpenTime: process.env.BUSINESS_OPEN_TIME || '06:00',
  businessCloseTime: process.env.BUSINESS_CLOSE_TIME || '22:30',
  minPreparationMinutes: parseInt(process.env.MIN_PREPARATION_MINUTES, 10) || 15,
  packagingCharge: process.env.PACKAGING_CHARGE !== undefined && !isNaN(parseFloat(process.env.PACKAGING_CHARGE))
    ? parseFloat(process.env.PACKAGING_CHARGE)
    : 15.0,
  gstPercentage: process.env.GST_PERCENTAGE !== undefined && !isNaN(parseFloat(process.env.GST_PERCENTAGE))
    ? parseFloat(process.env.GST_PERCENTAGE)
    : 5.0,
};

module.exports = env;
