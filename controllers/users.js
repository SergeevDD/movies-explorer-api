const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const user = require('../models/user');
const { SECRET_STRING } = require('../utils/config');
const NotFoundError = require('../errors/not-found-err');
const AuthenticationError = require('../errors/authentication-err');

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user;
  user.findById(userId)
    .then((foundUser) => {
      if (!foundUser) {
        throw new NotFoundError('Информация о пользователе отсутствует');
      }
      res.send(foundUser);
    })
    .catch(next);
};

module.exports.setUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  user.findByIdAndUpdate(
    req.user,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((userInfo) => {
      if (!userInfo) {
        throw new NotFoundError('Не удалось обновить данные пользователя');
      }
      res.send(userInfo);
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  try {
    res.clearCookie('jwt', { httpOnly: true });
    res.send({ bye: 'До встречи!' });
  } catch (err) { throw new Error(err); }
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  user.findOne({ email }).select('+password')
    .then((foundUser) => {
      if (!foundUser) {
        throw new AuthenticationError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, foundUser.password)
        .then((match) => {
          if (!match) {
            throw new AuthenticationError('Неправильные почта или пароль');
          }
          const token = jwt.sign(
            { _id: foundUser._id },
            SECRET_STRING,
            { expiresIn: '7d' },
          );
          res.cookie('jwt', token, {
            maxAge: 3600000,
            httpOnly: true,
          });
          res.send({ email: foundUser.email });
        })
        .catch(() => { throw new AuthenticationError('Ошибка создания токена'); });
    })
    .catch(next);
};
