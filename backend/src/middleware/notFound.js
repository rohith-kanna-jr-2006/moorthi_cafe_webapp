const AppError = require('../utils/AppError');

const notFound = (req, res, next) => {
  next(new AppError(`Cannot ${req.method} ${req.originalUrl} — route not found on this server`, 404));
};

module.exports = notFound;
