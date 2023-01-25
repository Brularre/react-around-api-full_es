const express = require('express');
const mongoose = require('mongoose');
const process = require('process');
const { celebrate, Joi } = require('celebrate');

const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const cardsRouter = require('./routes/cards');
const usersRouter = require('./routes/users');

const app = express();
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/aroundb');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error: '));
db.once('open', () => console.log('Connected successfully to database'));

// Rutas y Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

process.on('uncaughtException', (err, origin) => {
  throw new Error(`${origin} ${err.name}: ${err.message}.`);
});

app.use((req, res, next) => {
  req.user = {
    _id: '63d145ce6b342b3e643cd435',
  };
  next();
});

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

app.use((req, res) => {
  res.status(404).send({ message: 'Recurso solicitado no encontrado.' });
});

const { PORT = 3000 } = process.env;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
