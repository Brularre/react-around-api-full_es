const router = require('express').Router();

const {
  getUsers,
  getUser,
  getCurrentUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:id', getUser);
router.patch('/:id', updateProfile);
router.patch('/:id/avatar', updateAvatar);

module.exports = router;
