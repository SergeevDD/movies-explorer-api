const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimiter = require('./middlewares/limiter');
const { login, logout, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
const {
  SERVER_PORT,
  DB,
} = require('./utils/config');

const app = express();
app.use(express.json());
mongoose.connect(DB, {
  family: 4,
});

app.use(rateLimiter);
app.use(requestLogger);
app.use(helmet());
app.use(cors);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(30)
      .email(),
    password: Joi.string().required().min(2),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().min(2).max(30)
      .email(),
    password: Joi.string().required().min(2),
  }),
}), createUser);

app.use(cookieParser());
app.use(auth);
app.delete('/signout', logout);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/movies'));

app.use('/404', () => { throw new NotFoundError('E R R O R 4 0 4'); });
app.use('*', () => { throw new NotFoundError('Запрошен несуществующий роут'); });

app.use(errorLogger);

app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(SERVER_PORT, () => {
  console.log(`Сервер запущен на порту : ${SERVER_PORT}`);
});
