const jwt = require('jsonwebtoken');
const ValidationError = require('../errors/validation-err');

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
    payload = jwt.verify(token, 'secret-development');
  } catch (err) {
    return handleAuthError();
  }
  req.user = payload;

  next();
  return null;
}

module.exports = auth;
