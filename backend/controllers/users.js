const User = require('../models/user');

function createUser(req, res) {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
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

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateProfile,
  updateAvatar,
};
