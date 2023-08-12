const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const { login, logout, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
require('dotenv').config();

//helmet, limiter?
const {
  PORT = '3000',
  DB_URI = 'mongodb://localhost:27017/filmcollectondb',
} = process.env;

const app = express();
app.use(express.json());
mongoose.connect(DB_URI, {
  family: 4,
});

app.use(requestLogger);

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

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Сервер запущен на порту : ${PORT}`);
});
