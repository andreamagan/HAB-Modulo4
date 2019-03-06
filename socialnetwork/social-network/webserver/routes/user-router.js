'use strict';

const express = require('express');
const getUserProfile = require('../controllers/user/get-user-profile');
const checkJwtToken = require('../controllers/session/check-jwt-token');
const updateUserProfile = require('../controllers/user/update-user-profile');

const router = express.Router();


router.get('/user', checkJwtToken, getUserProfile);
router.put('/user', checkJwtToken, updateUserProfile);

router.post('/user/avatar', checkJwtToken, (req, res, next) => {
  res.status(204).send();
});

module.exports = router;
