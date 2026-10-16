const jwt = require('jsonwebtoken');
const env = require('../config/env');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Authentication required. Please provide a valid Bearer token', 401));
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return next(new AppError('Malformed authorization header. Token is missing', 401));
  }

  const decoded = jwt.verify(token, env.jwtSecret);
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new AppError('The user belonging to this token no longer exists', 401));
  }

  if (!user.isActive) {
    return next(new AppError('Your account has been deactivated. Please contact cafe support', 403));
  }

  req.user = user;
  next();
});

module.exports = authenticate;
