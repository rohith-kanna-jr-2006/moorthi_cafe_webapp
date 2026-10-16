const AppError = require('../utils/AppError');

/**
 * Validates request payload against a validator function or schema
 */
const validate = (validatorFn) => {
  return (req, res, next) => {
    const { valid, errors } = validatorFn(req.body, req);
    if (!valid) {
      return next(new AppError('Submitted data failed validation', 400, errors));
    }
    next();
  };
};

module.exports = validate;
