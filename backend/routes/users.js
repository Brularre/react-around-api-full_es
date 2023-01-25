const router = require('express').Router();

const {
  getUsers,
  getUser,
  getCurrentUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/users/', getUsers);
router.get('/users/me', getCurrentUser);
router.get('/users/:id', getUser);
router.patch('/users/:id', updateProfile);
router.patch('/users/:id/avatar', updateAvatar);

module.exports = router;
