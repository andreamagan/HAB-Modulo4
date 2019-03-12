'use strict';

const PostModel = require('../models/post-model');
const WallModel = require('../models/wall-model');

async function getPostById(postIds) {
  const filter = {
    _id: {
      $in: postIds,
    },
    deletedAt: null,
  };

  const posts = await PostModel.find(filter).lean();

  return posts;
}

async function getUserWall(req, res, next) {
  const { uuid } = req.claims;

  const filter = {
    uuid,
  };

  const projection = {
    _id: 0,
    posts: 1,
  };

  try {
    const wall = await WallModel.findOne(filter, projection).lean();
    if (!wall) {
      return {
        data: [],
      };
    };

    const posts = await getPostById(wall.posts);
    const response = {
      data: posts,
    }

    return res.send(response);
  } catch (e) {
    return res.status(500).send(e.message);
  }

}

module.exports = getUserWall;