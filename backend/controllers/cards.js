const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');

function createCard(req, res, next) {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.send({ data: card });
    })
    .catch(next);
}

function getCards(req, res, next) {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(next);
}

function deleteCard(req, res, next) {
  Card.findByIdAndRemove(req.params.id)
    .orFail(() => {
      throw new NotFoundError('No se encuentra una tarjeta con esa id');
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch(next);
}

function likeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('No se encuentra una tarjeta con esa id');
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch(next);
}

function dislikeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('No se encuentra una tarjeta con esa id');
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch(next);
}

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
