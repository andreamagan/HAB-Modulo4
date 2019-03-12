'use strict';

const Joi = require('joi');
const UserModel = require('../models/user-model');


async function validate(payload) {

  const schema = {
    textToFind: Joi.string().min(3).max(128).required(),
  };

  return Joi.validate(payload, schema);
}

async function searchUsers(req, res, next) {
  const { textToFind } = req.query;

  try {
    // const payload = {
    //   textToFind
    // },
    await validate({ textToFind });
  } catch (e) {
    return res.status(400).send(e);
  }

  const op = {
    $text: {
      $search: textToFind,
    },
  };

  const score = {
    score: {
      $meta: 'textScore',
    },
  };

  try {

    const users = await UserModel.find(op, score).sort(score).lean();
    const usersMinimunInfo = users.map((userResult) => {
      const {
        uuid,
        fullName,
        avatarUrl,
        score,
      } = userResult;

      return {
        uuid,
        fullName,
        avatarUrl,
        score,
      };
    });

    return res.send(usersMinimunInfo);
  } catch (e) {
    return res.status(500).send(e.message);
  }

}

module.exports = searchUsers;