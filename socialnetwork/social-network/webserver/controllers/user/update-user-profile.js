'use strict';

const Joi = require('joi');
const dot = require('dot-object');

const UserModel = require('../models/user-model');


async function validate(payload) {
  const schema = {
    /** No es necesario porque el uuid está en el token y es inmutable
    *  uuid: Joi.string().guid({
    *  version: ['uuidv4'],
    * }),
    */
    fullName: Joi.string().min(3).max(128).required(),
    preferences: Joi.object().keys({
      isPublicProfile: Joi.bool(),
      linkedIn: Joi.string().allow(null),
      twitter: Joi.string().allow(null),
      github: Joi.string().uri(null),
      description: Joi.string().allow(null),
    }),
  };

  return Joi.validate(payload, schema);
}

async function updateUserProfile(req, res, next) {
  const userDataProfile = { ...req.body };
  const { claims } = req;
  /**
  * Validar los datos
  */

  try {
    await validate(userDataProfile);
  } catch (e) {
    return res.status(400).send(e);
  }

  /**
   * Actualizar los datos en mongo
   */

  /* Forma manual de hacer el dot
  const userDataProfileMogoose = {
    fullName: userDataProfile.fullName,
    'preferences.isPublicProfil': userDataProfile.preferences.isPublicProfile,
    'preferences.linkedIn': userDataProfile.preferences.linkedIn,
    'preferences.twitter': userDataProfile.preferences.twitter,
    'preferences.github': userDataProfile.preferences.github,
    'preferences.description': userDataProfile.preferences.description,
  };
  */

  try {

    const userDataProfileMogoose = dot.dot(userDataProfile);
    const data = await UserModel.updateOne({ uuid: claims.uuid }, userDataProfileMogoose);
    console.log('mongoose data', data);
    return res.status(204).send();
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = updateUserProfile;
