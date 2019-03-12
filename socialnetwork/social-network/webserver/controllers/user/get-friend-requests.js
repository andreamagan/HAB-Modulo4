'use strict';

const UserModel = require('../models/user-model');

async function getFriendRequests(req, res, next) {
  const { uuid } = req.claims;

  //buscar los ids de mis posibles amigos

  try {
    const allFriendsResults = await UserModel.findOne({ uuid });
    const friendsUuids = allFriendsResults.friends.map(f => f.uuid); // [uuid1, uuid2, ..., uuid n]

    const filterRequests = {
      uuid: {
        $in: friendsUuids,
      },
      $and:
        [{ 'friends.confirmedAt': null },
        { 'friends.rejectedAt': null }],
    };

    const projectionFriendsData = {
      uuid: 1,
      avatarUrl: 1,
      fullName: 1,
      _id: 0,
    };

    const users = await UserModel.find(filterRequests, projectionFriendsData).lean();
    return res.send({
      data: users,
    });
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = getFriendRequests;