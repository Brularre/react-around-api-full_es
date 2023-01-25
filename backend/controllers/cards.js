const Card = require('../models/card');

function createCard(req, res) {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
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

function getCards(req, res) {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      res
        .status(500)
        .send({ message: 'Tuvimos un problema. Intentalo más tarde.' });
    });
}

function deleteCard(req, res) {
  Card.findByIdAndRemove(req.params.id)
    .orFail(() => {
      const error = new Error('No se encuentra una tarjeta con esa id');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => res.send({ data: card }))
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

function likeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const error = new Error('No se encuentra una tarjeta con esa id');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => res.send({ data: card }))
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

function dislikeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
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

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
