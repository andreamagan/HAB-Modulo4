'use strict';

const axios = require('axios');
const bodyParser = require('body-parser');
const express = require('express');

const app = express();


app.use(bodyParser.json());

app.get('/api/proxy/pokemons', (req, res, next) => {
  /**
   * 1. Necesito hacer una request a la api de terceros para tener los pokemons
   */
  axios({
    method: 'GET',
    url: 'https://pokeapi.co/api/v2/pokemon',
  }).then((response) => {
    res.send(response.data);
  }).catch((err) => {
    console.error('error', err);
    res.status(5000).send();
  });
});

app.get('/api/tests/test01', (req, res, next) => {
  console.log('Recibí los siguientes query params', req.query);

  res.send(req.query);
});


/**
 * To test it from terminal:
 * curl http://localhost:8000/api/pokemons -d '{"name":"pikachu","attacks":[]}' -H 'content-type: application/json' -v
 */
app.post('/api/pokemons', (req, res, next) => {
  const pokemonData = Object.assign({}, req.body);

  console.log('me llego el siguiente request body', pokemonData);
  /**
   * Simulamos insertar en una bbdd que siempre hay delay
   */
  setTimeout(() => {
    res.status(201).send();
  }, 2000);

  req.REQUEST_ID = '1234';
  next();
});

/**
 * Middleware de ejemplo para hacer un console.log
 */

// app.use((req, res, next) => {
//   console.log('Recibi la request', req.REQUEST_ID)
// });

app.get('/api/pokemons', (req, res, next) => {
  const pokemon2 = {
    name: 'bulbasaur',
    attacks: ['whip'], // Si ponemos un atributo undefined no se mandará ese atributo. 
  };

  const data = [{
    name: 'pikachu',
    attacks: ['rayo', 'impactrueno'],
  }, pokemon2, {
    name: 'charmander',
    attacks: ['fire ball'],
  }];

  res.send(data);
});

app.get('/api/pokemons/:name', (req, res, next) => {

  const pokemons = [{
    name: 'pikachu',
    attacks: ['rayo', 'impactrueno'],
  }, {
    name: 'bulbasaur',
    attacks: ['whip'],
  }, {
    name: 'charmander',
    attacks: ['fire ball'],
  }];
  const { name } = req.params;
  // const name = req.params.name; 
  /**
 * Dado el nombre de un prokemon, recorrer nuestro array, devolver los datos de ese pokemon
 */
  const pokemonsFound = pokemons.filter((pokemon) => {
    if (pokemon.name === name) {
      return true;
    }
    return false;
  });

  if (pokemonsFound.length === 0) {
    res.status(404).send('not found');
  } else {
    res.send(pokemonsFound[0]);
  }
});

app.listen(8000, () => {
  console.log('Server running on port 8000');
});
