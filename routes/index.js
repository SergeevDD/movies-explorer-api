const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const check = require('../middlewares/check');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');
const { login, logout, createUser } = require('../controllers/users');
const { validateLogin, validateRegister } = require('../middlewares/validator');

router.post('/signin', validateLogin, login);
router.post('/signup', validateRegister, createUser);
router.delete('/signout', logout);

router.get('/check', check);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use('/404', () => { throw new NotFoundError('E R R O R 4 0 4'); });
router.use('*', () => { throw new NotFoundError('Запрошен несуществующий адрес'); });

module.exports = router;
