'use strict';

const Joi = require('joi');
const PostModel = require('../models/post-model');


async function validate(payload) {
  const schema = {
    //author: Joi.sting().guid({version:['uuidv4']}),
    content: Joi.string().min(3).max(500).required(),
  };

  return Joi.validate(payload, schema);
};

async function createPost(req, res, next) {
  const postContent = { ...req.body };
  const { claims } = req;

  try {
    await validate(postContent);
  } catch (e) {
    // Create validation error
    return res.status(400).send(e);
  }

  const postToCreate = {
    owner: claims.uuid,
    author: claims.uuid,
    content: postContent.content,
    createdAt: Date.now(),
    comments: [],
    likes: [],
    deleteAt: null,
  };

  try {
    const postCreated = await PostModel.create(postToCreate);
    return res.status(201).send(postCreated);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = createPost;