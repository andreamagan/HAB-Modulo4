'use strict';

const express = require('express');

const app = express();

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
