const express = require('express');
const mongoose = require('mongoose');
const process = require('process');

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/aroundb');

const cardsRouter = require('./routes/cards');
const usersRouter = require('./routes/users');

app.use(express.json());
process.on('uncaughtException', (err, origin) => {
  throw new Error(`${origin} ${err.name}: ${err.message}.`);
});

app.use((req, res, next) => {
  req.user = {
    _id: '63c5b504578285031001cce0',
  };
  next();
});

app.use('/', cardsRouter);
app.use('/', usersRouter);
app.use((req, res) => {
  res.status(404).send({ message: 'Recurso solicitado no encontrado.' });
});

const { PORT = 3000 } = process.env;
app.listen(PORT);
