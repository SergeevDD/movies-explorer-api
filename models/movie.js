const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 60,
  },
  director: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 60,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 4,
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  },
  image: {
    type: String,
    validate: {
      validator: (u) => isURL(u, {
        require_valid_protocol: true,
        protocols: ['http', 'https'],
      }),
      message: 'Неверный формат ссылки на постер к фильму',
    },
    required: true,
  },
  trailerLink: {
    type: String,
    validate: {
      validator: (u) => isURL(u, {
        require_valid_protocol: true,
        protocols: ['http', 'https'],
      }),
      message: 'Неверный формат ссылки на трейлер фильма',
    },
    required: true,
  },
  thumbnail: {
    type: String,
    validate: {
      validator: (u) => isURL(u, {
        require_valid_protocol: true,
        protocols: ['http', 'https'],
      }),
      message: 'Неверный формат ссылки на мини постер',
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  movieId: [{
    type: Number,
    required: true,
  }],
  nameRU: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  nameEN: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

module.exports = mongoose.model('movie', movieSchema);
