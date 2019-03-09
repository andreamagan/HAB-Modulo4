'use strict';

const Joi = require('joi');
const UserModel = require('../models/user-model')

async function validate(payload) {
  const schema = {
    friendUuid: Joi.string().guid({
      version: ['uuidv4'],
    }),
  };
  return Joi.validate(payload, schema);
}

async function addConfirmedFriend(friendUuid, me) {

  const now = Date.now();

  const filterFriend = {
    uuid: friendUuid,
  }

  const updateFriend = {
    $push: {
      friends: {
        createdAt: now,
        confirmedAt: now,
        rejectedAt: null,
        uuid: me,
      },
    },
  };

  await UserModel.findOneAndUpdate(filterFriend, updateFriend, { rawResult: true });

  //edge case, eliminar peticiones anteriores si se hizo una petición de uno a dos y de dos a uno cuando alguien confirme

  const deleteOp = {
    $pull: {
      friends: {
        uuid: me,
        confirmAt: null,
      },
    },
  };

  await UserModel.findOneAndUpdate(filterFriend, deleteOp);

}

async function acceptFriendRequest(req, res, next) {
  const { uuid: friendUuid } = req.body;
  const { uuid: me } = req.claims;

  try {
    await validate({ friendUuid });
  } catch (e) {
    return res.status(400).send(e.message);
  }

  const filter = {
    uuid: me,
    'friends.uuid': friendUuid,
    'friedns.confiermedAt': null,
  };



  const update = {
    $set: { "friends.$.confirmedAt": now, }
  };

  try {
    const result = await UserModel.findOneAndUpdate(filter, update, { rawResult: true });

    await acceptFriendRequest(friendUuid, me);

    return res.status(200).send();
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = acceptFriendRequest;