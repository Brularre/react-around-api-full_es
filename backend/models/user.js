const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');
const isURL = require('validator/lib/isURL');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Jacques Cousteau',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Explorador',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg',
    validate: {
      validator: (v) => isURL(v),
      message: 'Por favor intenta una URL Valida.',
    },
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, 'Requiere un correo electrónico'],
    validate: {
      validator: (v) => isEmail(v),
      message: 'Formato de correo electrónico incorrecto',
    },
  },
  password: {
    type: String,
    required: [true, 'Requiere una contraseña'],
    minlength: 8,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new Error('Correo o contraseña incorrectos. Intenta de nuevo'),
        );
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new Error('Correo o contraseña incorrectos. Intenta de nuevo'),
          );
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
