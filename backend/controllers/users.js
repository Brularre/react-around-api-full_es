const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const NotFoundError = require('../errors/not-found-err');
const RequestError = require('../errors/request-err');
const ValidationError = require('../errors/validation-err');

// const { NODE_ENV, JWT_SECRET } = process.env;

// User DB Interaction

function getUsers(req, res, next) {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
}

function getUser(req, res, next) {
  User.findById(req.params.id)
    .orFail(() => {
      throw new NotFoundError('No se encuentra usuario con esa id');
    })
    .then((users) => {
      if (!users) {
        throw new RequestError('Hay un problema con la solicitud');
      }
      res.send({ data: users });
    })
    .catch(next);
}

function getCurrentUser(req, res, next) {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new RequestError('Hay un problema con la solicitud');
      }
      res.send({ data: user });
    })
    .catch(next);
}

function createUser(req, res, next) {
  const { name, about, avatar, email } = req.body;
  bcrypt
    .hash(req.body.password, 10)
    .then((password) => User.create({ name, about, avatar, email, password }))
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Hay un problema con los datos');
      }
      next();
    });
}

function updateProfile(req, res, next) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.params.id,
    {
      name,
      about,
    },
    { runValidators: true, new: true },
  )
    .then((user) => {
      if (!user) {
        throw new RequestError('Hay un problema con la solicitud');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Hay un problema con los datos');
      }
      next();
    });
}

function updateAvatar(req, res, next) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.params.id,
    {
      avatar,
    },
    { runValidators: true, new: true },
  )
    .then((user) => {
      if (!user) {
        throw new RequestError('Hay un problema con la solicitud');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Hay un problema con los datos');
      }
      next();
    });
}

// User Authentication

function login(req, res, next) {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        // NODE_ENV === 'production' ? JWT_SECRET : 'secret-development',
        'secret-development',
        {
          expiresIn: '7d',
        },
      );
      res.send({ token });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Correo o contraseña incorrectos');
      }
      next();
    });
}

module.exports = {
  getUsers,
  getUser,
  getCurrentUser,
  createUser,
  updateProfile,
  updateAvatar,
  login,
};
