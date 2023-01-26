const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');

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
    validate: {
      validator(v) {
        return /^(http(s):\/\/.)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/.test(
          v,
        );
      },
      message: 'Por favor intenta una URL Valida.',
    },
    default: 'https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg',
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
