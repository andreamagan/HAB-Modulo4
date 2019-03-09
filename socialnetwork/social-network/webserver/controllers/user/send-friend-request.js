'use strict';

const Joi = require('joi');
const UserModel = require('../models/user-model')

async function validate(payload) {
  const schema = {
    friend: Joi.string().guid({
      version: ['uuidv4'],
    }),
  }
  return Joi.validate(payload, schema);
}

async function sendFriendRequest(req, res, next) {
  const { friend } = req.body;
  const { claims } = req;

  try {
    await validate({ friend });
  } catch (e) {
    return res.status(400).send(e.message);
  }

  if (claims.uuid === friend.uuid) {
    return res.status(403).send(); // 409 conflict
  }

  const filter = {
    uuid: friend,
    friends: {
      $not: {
        $elemMatch: {
          uuid: claims.uuid,
        },
      },
    },
  };

  const update = {
    $push: {
      friends: {
        createAt: Date.now(),
        rejectAt: null,
        confirmAt: null,
        uuid: claims.uuid,
      },
    },
  };

  try {
    const result = await UserModel.findOneAndUpdate(filter, update);
    console.log(result);
    return res.status(204).send(); //201 si mandamos a frontend el objeto de la peticion

  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = sendFriendRequest;
