const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');

/**
 * Optional authentication middleware:
 * Populates req.user if a valid Bearer token is provided, without rejecting requests lacking authentication.
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const decoded = jwt.verify(token, env.jwtSecret);
        const user = await User.findById(decoded.id);
        if (user && user.isActive) {
          req.user = user;
        }
      }
    }
  } catch (err) {
    // Silently ignore token errors for optional authentication
  }
  next();
};

module.exports = optionalAuth;
