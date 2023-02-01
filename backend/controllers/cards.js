const Card = require('../models/card');
const RequestError = require('../errors/request-err');
const NotFoundError = require('../errors/not-found-err');

// function createCard(req, res, next) {
//   const { name, link } = req.body;
//   const owner = req.user._id;
//   Card.create({ name, link, owner })
//     .then((card) => {
//       if (!card) {
//         throw new RequestError('Hay un problema con la solicitud');
//       }
//       res.send({ data: card });
//     })
//     .catch(next);
// }

// function deleteCard(req, res, next) {
//   Card.findByIdAndRemove(req.params.id)
//     .orFail(() => {
//       throw new NotFoundError('No se encuentra una tarjeta con esa id');
//     })
//     .then((card) => {
//       if (!card) {
//         throw new RequestError('Hay un problema con la solicitud');
//       }
//       res.send({ data: card });
//     })
//     .catch(next);
// }

// function likeCard(req, res, next) {
//   Card.findByIdAndUpdate(
//     req.params.id,
//     { $addToSet: { likes: req.user._id } },
//     { new: true },
//   )
//     .orFail(() => {
//       throw new NotFoundError('No se encuentra una tarjeta con esa id');
//     })
//     .then((card) => {
//       if (!card) {
//         throw new RequestError('Hay un problema con la solicitud');
//       }
//       res.send({ data: card });
//     })
//     .catch(next);
// }

// function dislikeCard(req, res, next) {
//   Card.findByIdAndUpdate(
//     req.params.id,
//     { $pull: { likes: req.user._id } },
//     { new: true },
//   )
//     .orFail(() => {
//       throw new NotFoundError('No se encuentra una tarjeta con esa id');
//     })
//     .then((card) => {
//       if (!card) {
//         throw new RequestError('Hay un problema con la solicitud');
//       }
//       res.send({ data: card });
//     })
//     .catch(next);
// }

/* Original */
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
      const error = new Error('Ningún usuario encontrado con ese id');
      error.statusCode = 404;
      throw error;
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
      const error = new Error('Ningún usuario encontrado con ese id');
      error.statusCode = 404;
      throw error;
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
      const error = new Error('Ningún usuario encontrado con ese id');
      error.statusCode = 404;
      throw error;
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
