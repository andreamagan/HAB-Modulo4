'use strict';


const bodyParser = require('body-parser');
const express = require('express');

const proxyRouter = require('./routers/proxy-routers');
const pokemonsRouter = require('./routers/pokemons-routers');
const testRouter = require('./routers/tests-routers');

const app = express();


app.use(bodyParser.json());

//Middleware
app.use((req, res, next) => {
  req.startDate = Date.now();
  next();
});

app.use('/api', testRouter);
app.use('/api', proxyRouter);
app.use('/api', pokemonsRouter);

// Middleware
app.use((req, res, next) => {
  const endDate = Date.now();
  const diff = (endDate - req.startDate);
  console.log(`La request ha tardado  ${diff} ms.`);
});

app.listen(8000, () => {
  console.log('Server running on port 8000');
});
