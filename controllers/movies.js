const movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const AccessError = require('../errors/access-err');

module.exports.getMovies = (req, res, next) => {
  movie.find({ owner: req.user })
    .populate('owner')
    .then((movies) => {
      if (!movies) {
        throw new NotFoundError('Фильмы не найдены');
      }
      res.send(movies);
    })
    .catch(next);
};

module.exports.createMovie = async (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  await movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  })
    .then((populateMovie) => populateMovie.populate('owner'))
    .then((newMovie) => {
      if (!newMovie) {
        throw new NotFoundError('Не удалось добавить фильм');
      }
      res.send(newMovie);
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  movie.findById(req.params.movieId)
    .then((dbMovie) => {
      if (!dbMovie) {
        throw new NotFoundError('Фильм не наден');
      }
      if (dbMovie.owner.toString() !== req.user) {
        throw new AccessError('У вас нет прав на удаление');
      }
      return dbMovie.deleteOne({ _id: dbMovie._id })
        .then((c) => {
          if (c.deletedCount === 1) {
            return dbMovie;
          }
        })
        .then((removedMovie) => res.send({ data: removedMovie }));
    })
    .catch(next);
};
