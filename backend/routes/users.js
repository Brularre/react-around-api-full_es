const router = require('express').Router();

const {
  getUsers,
  getUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/users/', getUsers);
router.get('/users/:id', getUser);
router.get('/users/me');
router.patch('/users/:id', updateProfile);
router.patch('/users/:id/avatar', updateAvatar);

module.exports = router;
