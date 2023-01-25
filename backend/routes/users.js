const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUser,
  getCurrentUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get(
  '/users/',
  celebrate({
    body: Joi.object().keys({
      idname: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().custom(validateURL),
      email: Joi.string().required().email(),
      password: Joi.string().min(8),
    }),
  }),
  getUsers,
);
router.get('/users/me', getCurrentUser);
router.get('/users/:id', getUser);
router.patch('/users/:id', updateProfile);
router.patch('/users/:id/avatar', updateAvatar);

module.exports = router;
