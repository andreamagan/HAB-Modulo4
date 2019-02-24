'use strict';

const express = require('express');

const router = express.Router();

/**
 * Definimos las rutas que estén bajo api/tests
 */

router.get('/test/test01', (req, res, next) => {
  console.log('Recibí los query params: ', req.query);

  res.send(req.query);
});

router.get('/test/test02', (req, res, next) => {
  console.log('Recibí los query params: ', req.query);

  res.send(req.query);
});

module.exports = router;
