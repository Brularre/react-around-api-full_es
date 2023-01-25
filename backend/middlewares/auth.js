const jwt = require('jsonwebtoken');
const ValidationError = require('../errors/validation-err');

const extractBearerToken = (header) => header.replace('Bearer ', '');

function auth(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ValidationError('Se requiere autorización');
  }
  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'secret-development');
  } catch (err) {
    throw new ValidationError('Se requiere autorización');
  }
  req.user = payload;

  next();
}

module.exports = auth;
