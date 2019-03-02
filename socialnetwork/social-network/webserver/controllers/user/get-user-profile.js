'use strict';

const UserModel = require('../models/user-model');

async function getUserProfile(req, res, next) {
  const { claims } = req;

  /**
   * try {
      const userDataProfileMogoose = dot.dot(userDataProfile);
      const data = await UserModel.updateOne({ uuid: claims.uuid }, userDataProfileMogoose);
      console.log('mongoose data', data);
      return res.status(204).send();
    } catch (e) {
      return res.status(500).send(e.message);
    }
   */

  try {
    const userDataProfile = await UserModel.find({ uuid: claims.uuid });
    console.log(userDataProfile);
    return res.status(200).send(userDataProfile);
  } catch (e) {
    return res.status(404).send(e.message);
  }
}

module.exports = getUserProfile;
