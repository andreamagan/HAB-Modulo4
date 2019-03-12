'use strict';

const Joi = require('joi');
const PostModel = require('../models/post-model');
const WallModel = require('../models/wall-model');
const UserModel = require('../models/user-model');


async function validate(payload) {
  const schema = {
    content: Joi.string().min(3).max(500).required(),
  };

  return Joi.validate(payload, schema);
};

async function createWall(uuid, postId) {

  const filter = {
    owner: uuid,
  };

  const update = {
    $addToSet: {
      posts: postId,
    }
  };

  const options = { upsert: true };

  const wallCreated = await WallModel.findOneAndUpdate(filter, update, options).lean();

  console.log(wallCreated);

  return wallCreated;
}

async function sendPostToAllMyFriends(postId, uuid) {
  const filter = {
    uuid,
  };

  const myFriends = await UserModel.findOne(filter).lean();


  const myFriendsUuids = myFriends.friends.map(f => f.uuid)

  console.log(myFriendsUuids)

  const filterFriends = {
    owner: myFriendsUuids,
  };

  const update = {
    $addToSet: {
      posts: postId,
    }
  };
  const options = { upsert: true };

  const result = await WallModel.updateMany(filterFriends, update, options).lean();

  console.log('insertar post en el muro de mis amigos', result);

  return result;
}

async function createPost(req, res, next) {
  const { claims } = req;
  const { uuid } = claims;

  const postContent = { ...req.body };

  try {
    await validate(postContent);
  } catch (e) {
    // Create validation error
    return res.status(400).send(e);
  }

  const postToCreate = {
    owner: uuid,
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

    const wallCreated = await createWall(uuid, postId);

    const notify = await sendPostToAllMyFriends(postId, uuid);

    return res.status(201).send(wallCreated);
  } catch (e) {
    return res.status(500).send(e.message);
  };


}

module.exports = createPost;