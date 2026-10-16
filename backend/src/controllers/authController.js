const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      name: user.name,
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
};

const formatUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt,
});

// @desc    Register a new customer account
// @route   POST /api/v1/auth/signup
// @access  Public
const signup = asyncHandler(async (req, res, next) => {
  const { name, email, phone, password } = req.body;

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return next(new AppError('An account with this email address is already registered', 409));
  }

  const passwordHash = await User.hashPassword(password);

  // STRICT SECURITY RULE: Public signup can ONLY create customers.
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    phone: phone.trim(),
    passwordHash,
    role: 'customer',
    isActive: true,
  });

  const token = generateToken(user);

  res.status(201).json({
    success: true,
    message: 'Dining account created successfully. Welcome to Hotel New Moorthi Cafe!',
    data: {
      user: formatUserResponse(user),
      token,
    },
  });
});

// @desc    Sign in with email or registered mobile
// @route   POST /api/v1/auth/login
// @access  Public
const login = asyncHandler(async (req, res, next) => {
  const { identifier, email, password } = req.body;
  const loginInput = (identifier || email || '').trim();

  // Search by either lowercased email or phone number
  const isEmail = loginInput.includes('@');
  const query = isEmail
    ? { email: loginInput.toLowerCase() }
    : { phone: loginInput };

  // Explicitly select passwordHash which is hidden by default
  const user = await User.findOne(query).select('+passwordHash');

  if (!user) {
    return next(new AppError('Invalid credentials. Please verify your login details and password', 401));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new AppError('Invalid credentials. Please verify your login details and password', 401));
  }

  if (!user.isActive) {
    return next(new AppError('Your account has been deactivated. Please contact cafe support', 403));
  }

  const token = generateToken(user);

  res.status(200).json({
    success: true,
    message: 'Signed in successfully',
    data: {
      user: formatUserResponse(user),
      token,
    },
  });
});

// @desc    Get currently logged in user profile
// @route   GET /api/v1/auth/me
// @access  Private (Authenticated)
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Current profile retrieved successfully',
    data: {
      user: formatUserResponse(req.user),
    },
  });
});

module.exports = {
  signup,
  login,
  getMe,
  generateToken,
};
