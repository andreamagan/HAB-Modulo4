'use strict';

const express = require('express');

const router = express.Router();

/**
 * Definimos las rutas que estén bajo api/pokemons
 */

router.post('/pokemons', (req, res, next) => {
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

router.get('/pokemons', (req, res, next) => {
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

router.get('/api/pokemons/:name', (req, res, next) => {
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


module.exports = router;
