function validateSignup(body) {
  const errors = [];
  const { name, email, phone, password } = body || {};

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Full name must be at least 2 characters' });
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    errors.push({ field: 'email', message: 'A valid email address is required' });
  }

  const cleanPhone = (phone || '').replace(/[^0-9+]/g, '');
  if (!cleanPhone || cleanPhone.length < 10) {
    errors.push({ field: 'phone', message: 'A valid mobile number (min 10 digits) is required for SMS slips' });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters in length' });
  }

  return { valid: errors.length === 0, errors };
}

function validateLogin(body) {
  const errors = [];
  const { email, identifier, password } = body || {};
  const loginId = identifier || email;

  if (!loginId || typeof loginId !== 'string' || loginId.trim().length === 0) {
    errors.push({ field: 'identifier', message: 'Email address or registered mobile number is required' });
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  return { valid: errors.length === 0, errors };
}

module.exports = {
  validateSignup,
  validateLogin,
};
