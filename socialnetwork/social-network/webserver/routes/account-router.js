'use strict';

const express = require('express');
const createAccount = require('../controllers/account/create-account');
const activateAccount = require('../controllers/account/verified-account');

const accountRouter = express.Router();

accountRouter.post('/account', createAccount);
accountRouter.get('/account/activate', activateAccount);

module.exports = accountRouter;
