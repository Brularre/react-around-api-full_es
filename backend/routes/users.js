const router = require('express').Router();
const {
  createUser,
  getUsers,
  getUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.post('/users', createUser);
router.get('/users/', getUsers);
router.get('/users/:id', getUser);
router.patch('/users/:id', updateProfile);
router.patch('/users/:id/avatar', updateAvatar);

module.exports = router;
