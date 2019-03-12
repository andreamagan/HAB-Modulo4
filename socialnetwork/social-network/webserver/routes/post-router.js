'use strict';

const express = require('express');

const checkJwtToken = require('../controllers/session/check-jwt-token');
const createPost = require('../controllers/post/create-post');
const createPostAtFriendWall = require('../controllers/post/create-post-in-a-friend-wall');
const router = express.Router();

router.post('/post', checkJwtToken, createPost);
router.post('/user/wall', checkJwtToken, createPostAtFriendWall);

module.exports = router;