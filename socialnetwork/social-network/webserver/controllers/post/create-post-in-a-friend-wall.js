'use strict';

const Joi = require('joi');
const PostModel = require('../models/post-model');
const WallModel = require('../models/wall-model');

async function validate(payload) {
  const schema = {
    content: Joi.string().min(3).max(1200).required(),
  };

  return Joi.validate(payload, schema);
};


async function postAtFriendWall(uuidFriend, postId) {

  const filter = {
    owner: uuidFriend,
  };

  const update = {
    $addToSet: {
      posts: postId,
    }
  };

  const options = { upsert: true };

  const postAtFriend = await WallModel.findOneAndUpdate(filter, update, options).lean();

  console.log(postAtFriend);

  return postAtFriend;
}

async function createPostAtFriendWall(req, res, send) {
  const { uuidFriend } = req.query;
  const { uuid } = req.claims;

  const postContent = { ...req.body };

  try {
    await validate(postContent);
  } catch (e) {
    // Create validation error
    return res.status(400).send(e);
  }


  const postToCreate = {
    owner: uuidFriend,
    author: uuid,
    content: postContent.content,
    createdAt: Date.now(),
    comments: [],
    likes: [],
    deleteAt: null,
  };

  try {
    const postCreated = await PostModel.create(postToCreate);
    const postId = postCreated._id;

    const postAtFriend = await postAtFriendWall(uuidFriend, postId);
    return res.status(200).send(postCreated);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}
module.exports = createPostAtFriendWall;