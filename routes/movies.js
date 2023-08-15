const router = require('express').Router();
const { validateNewMovie, validateMovieId } = require('../middlewares/validator');
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', validateNewMovie, createMovie);
router.delete('/:movieId', validateMovieId, deleteMovie);

module.exports = router;
