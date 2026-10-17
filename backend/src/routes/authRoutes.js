const express = require('express');
const rateLimit = require('express-rate-limit');
const { signup, login, getMe } = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const { validateSignup, validateLogin } = require('../validators/authValidators');

const router = express.Router();

// Strict rate limiter for authentication endpoints to mitigate brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 30, // 30 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes',
  },
});

router.post('/signup', authLimiter, validate(validateSignup), signup);
router.post('/register', authLimiter, validate(validateSignup), signup);
router.post('/login', authLimiter, validate(validateLogin), login);
router.post('/logout', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Signed out successfully. Session terminated',
    data: null,
  });
});
router.get('/me', authenticate, getMe);

module.exports = router;
