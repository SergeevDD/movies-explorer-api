const limit = require('express-rate-limit');

const rateLimit = limit({
  windowMs: 1 * 60 * 60 * 1000,
  max: 150,
  message: 'Допустимое количество запросов превышено, попробуйте позже',
  headers: true,
});

module.exports = rateLimit;
