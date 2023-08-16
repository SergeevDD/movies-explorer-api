const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const rateLimiter = require('./middlewares/limiter');
const cors = require('./middlewares/cors');
const routes = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const {
  SERVER_PORT,
  DB,
} = require('./utils/config');

const app = express();
app.use(express.json());
mongoose.connect(DB, {
  family: 4,
});

app.use(requestLogger);
app.use(rateLimiter);
app.use(helmet());
app.use(cors);
app.use(cookieParser());
app.use(routes);
app.use(errorLogger);
app.use(errors());

app.use((err, _, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode)
    .send({
      message: statusCode === 500
        ? `Ошибка сервера: ${message}`
        : message,
    });
  next();
});

app.listen(SERVER_PORT, () => {});
