'use strict';

const axios = require('axios');

const express = require('express');

const router = express.Router();

/**
 * Definimos las rutas que estén bajo api/proxy
 */

router.get('/proxy/pokemons', (req, res, next) => {
  /**
   * 1.Request a la api de terceros para tener los pokemons
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

module.exports = router;
