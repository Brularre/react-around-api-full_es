const jwt = require('jsonwebtoken');
const ValidationError = require('../errors/validation-err');

// Original
// const auth = (req, res, next) => {
//   const { authorization } = req.headers;
//   if (!authorization || !authorization.startsWith('Bearer ')) {
//     throw new Error('Problemas con tus datos de usuario');
//   }
//   const token = authorization.replace('Bearer ', '');
//   let payload;
//   try {
//     payload = jwt.verify(token, 'secret-development');
//   } catch (err) {
//     throw new Error(err);
//   }
//   req.user = payload;
//   next();
// };

const handleAuthError = () => {
  throw new ValidationError('Se requiere autorización');
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

function auth(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError();
  }
  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'salt-temporal');
  } catch (err) {
    return handleAuthError();
  }
  req.user = payload;

  next();
  return null;
}

module.exports = auth;
