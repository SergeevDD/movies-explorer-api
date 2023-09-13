const { celebrate, Joi } = require('celebrate');

const isURL = /(http|https):\/\/[a-zA-Z0-9\-./_]+/;

const validateNewMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(500),
    director: Joi.string().required().min(2).max(500),
    duration: Joi.number().required().min(1).max(999),
    year: Joi.string().required().min(4),
    description: Joi.string().required().min(2).max(10000),
    image: Joi.string().required().regex(isURL).max(5000),
    trailerLink: Joi.string().required().regex(isURL).max(5000),
    nameRU: Joi.string().required().min(2).max(500),
    nameEN: Joi.string().required().min(2).max(500),
    thumbnail: Joi.string().required().regex(isURL).max(5000),
    movieId: Joi.number().required(),
  }),
});

const validateMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().alphanum().length(24),
  }),
});

const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email().min(2)
      .max(30),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(30)
      .email(),
    password: Joi.string().required().min(2),
  }),
});

const validateRegister = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().min(2).max(30)
      .email(),
    password: Joi.string().required().min(2),
  }),
});

module.exports = {
  validateNewMovie,
  validateMovieId,
  validateUser,
  validateLogin,
  validateRegister,
};
