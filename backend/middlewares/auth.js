const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Error('Problemas con tus datos de usuario');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'secret-development');
  } catch (err) {
    throw new Error(err);
  }
  req.user = payload;
  next();
};

module.exports = auth;
