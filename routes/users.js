const router = require('express').Router();
const { validateUser } = require('../middlewares/validator');
const {
  getCurrentUser,
  setUserInfo,
} = require('../controllers/users');

router.get('/me', getCurrentUser);
router.patch('/me', validateUser, setUserInfo);

module.exports = router;
