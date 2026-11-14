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

// Staging database protection
if (process.env.NODE_ENV === 'staging') {
  const uri = process.env.MONGODB_URI || '';
  // Extract database name from MongoDB URI
  // Format: mongodb+srv://user:pass@cluster.mongodb.net/DATABASE_NAME?options
  const dbNameMatch = uri.match(/\/([^/?#]+)(\?|$)/);
  const dbName = dbNameMatch ? dbNameMatch[1] : null;

  if (dbName !== 'moorthi_cafe_staging') {
    throw new Error(`[Staging Safety] NODE_ENV=staging requires MONGODB_URI database name to be 'moorthi_cafe_staging'. Current: '${dbName}'`);
  }
}

// Production isolation: prevent accidental production database use in non-production
if (process.env.NODE_ENV !== 'production') {
  const uri = process.env.MONGODB_URI || '';
  const dbNameMatch = uri.match(/\/([^/?#]+)(\?|$)/);
  const dbName = dbNameMatch ? dbNameMatch[1] : null;

  if (dbName === 'moorthi_cafe') {
    throw new Error('[Safety Guard] Non-production NODE_ENV must not use production database "moorthi_cafe". Current: production database detected.');
  }
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
