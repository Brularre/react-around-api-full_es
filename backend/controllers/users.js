const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

// User DB Interaction
function getUsers(req, res) {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err }));
}

function getUser(req, res) {
  User.findById(req.params.id)
    .orFail(() => {
      const error = new Error('No se encuentra usuario con esa id');
      error.statusCode = 404;
      throw error;
    })
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400);
      } else {
        res.status(500);
      }
      res
        .status(500)
        .send({ message: 'Tuvimos un problema. Intentalo más tarde.' });
    });
}

function getCurrentUser(req, res) {
  User.findById(req.user._id)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400);
      } else {
        res
          .status(500)
          .send({ message: 'Tuvimos un problema. Intentalo más tarde.' });
      }
    });
}

function createUser(req, res) {
  const { name, about, avatar, email } = req.body;
  bcrypt
    .hash(req.body.password, 10)
    .then((password) => User.create({ name, about, avatar, email, password }))
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send(err);
      } else {
        res.status(500).send({ message: err });
      }
      res
        .status(500)
        .send({ message: 'Tuvimos un problema. Intentalo más tarde.' });
    });
}

function updateProfile(req, res) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.params.id,
    {
      name,
      about,
    },
    { runValidators: true, new: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400);
      } else {
        res.status(500);
      }
      res
        .status(500)
        .send({ message: 'Tuvimos un problema. Intentalo más tarde.' });
    });
}

function updateAvatar(req, res) {
  console.log(req.body);
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.params.id,
    {
      avatar,
    },
    { runValidators: true, new: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400);
      } else {
        res.status(500);
      }
      res
        .status(500)
        .send({ message: 'Tuvimos un problema. Intentalo más tarde.' });
    });
}

// User Authentication

function login(req, res) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'salt-temporal', {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
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
