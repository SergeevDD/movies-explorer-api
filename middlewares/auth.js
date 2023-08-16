const jwt = require('jsonwebtoken');
const { SECRET_STRING } = require('../utils/config');
const AuthenticationError = require('../errors/authentication-err');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new AuthenticationError('Вы не авторизированы');
  }
  let payload;
  try {
    payload = jwt.verify(
      token,
      SECRET_STRING,
    );
  } catch (err) {
    throw new AuthenticationError('Доступ запрещен, неизвестный пользователь', err);
  }

  req.user = payload._id;
  next();
};
