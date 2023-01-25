const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
require('dotenv').config();

const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const cardsRouter = require('./routes/cards');
const usersRouter = require('./routes/users');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/aroundb');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error: '));
db.once('open', () => console.log('Connected successfully to database'));

// Rutas y Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas abiertas
app.post('/signin', login);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string(),
      email: Joi.string().required().email(),
      password: Joi.string().min(8),
    }),
  }),
  createUser,
);

// Rutas protegidas
app.use(auth);
app.use('/', cardsRouter);
app.use('/', usersRouter);

// Control de errores

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode, message } = err;
  res
    .status(statusCode || 500)
    .send(
      { message } || { message: 'Tuvimos un problema. Intentalo más tarde.' },
    );
});

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
