'use strict';

const bcrypt = require('bcrypt');
const uuidV4 = require('uuid/v4');
const Joi = require('joi');
const sgMail = require('@sendgrid/mail');
const UserModel = require('../models/user-model');
const mysqlPool = require('../../databases/mysql-pool');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 *  TODO: Insert user into MySQL
 *  hash the password using bcrypt library
 */

async function insertUserIntoDatabase(email, password) {
  const securePassword = await bcrypt.hash(password, 10); /* USE BCRYPT TO CIPHER THE PASSWORD */;
  const uuid = uuidV4();
  const now = new Date();
  const createdAt = now.toISOString().substring(0, 19).replace('T', ' ');

  console.log('secure password', securePassword, 'createdAt', createdAt);
  console.log('uuid', uuid);

  const connection = await mysqlPool.getConnection();

  await connection.query('INSERT INTO users SET ?', {
    uuid,
    email,
    password: securePassword,
    created_at: createdAt,
  });

  return uuid;
}


/**
 * TODO: CREATE VERIFICATION CODE AND INSERT IT INTO MySQL
 */
async function addVerificationCode(uuid) {
  const verificationCode = uuidV4();
  const now = new Date();
  const createdAt = now.toISOString().substring(0, 19).replace('T', ' ');
  const sqlQuery = 'INSERT INTO users_activation SET ?';
  const connection = await mysqlPool.getConnection();

  await connection.query(sqlQuery, {
    user_uuid: uuid,
    verification_code: verificationCode,
    created_at: createdAt,
  });

  connection.release();

  return verificationCode;
}

async function createUserProfile(uuid) {
  const userProfileData = {
    uuid,
    avatarUrl: null,
    fullName: null,
    friends: [],
    preferences: {
      isPublicProfile: false,
      linkedIn: null,
      twitter: null,
      github: null,
      description: null,
    },
  };

  try {
    const userCreated = await UserModel.create(userProfileData);

    console.log(userCreated);
  } catch (e) {
    console.error(e);
  }
}

/**
 * TODO: Send email to the user adding the verificationCode in the link
 */
// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

async function sendEmailRegistration(userEmail, verificationCode) {
  const msg = {
    to: userEmail,
    from: 'socialnetwork@yopmail.com',
    subject: 'Confirm your email',
    text: 'By clicking on the following link, you are confirming your email address.',
    html: `To activate your account, <a href="${process.env.HTTP_SERVER_DOMAIN}/api/account/activate?verification_code=${verificationCode}">click here</a>`,
  };
  const data = await sgMail.send(msg);

  return data;
}


async function validateSchema(payload) {
  /**
   * TODO: Fill email, password and full name rules to be (all fields are mandatory):
   *  email: Valid email
   *  password: Letters (upper and lower case) and number
   *    Minimun 3 and max 30 characters, using next regular expression: /^[a-zA-Z0-9]{3,30}$/
   * fullName: String with 3 minimun characters and max 128
   * https://www.npmjs.com/package/joi
   */

  const schema = {
    // email: rules.email,
    // password: rules.password,
    // fullName: rules.fullName,

    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
  };

  return Joi.validate(payload, schema);
}


async function create(req, res, next) {
  const accountData = { ...req.body };

  /**
   * Validate if user data is valid to create an account
   * in other case, generate a 400 Bad Request error
   */
  try {
    await validateSchema(accountData);
  } catch (e) {
    // Create validation error
    return res.status(400).send(e);
  }

  const {
    email,
    password,
  } = accountData;

  try {
    const uuid = await insertUserIntoDatabase(email, password);
    res.status(204).json();

    await createUserProfile(uuid);

    try {
      const verificationCode = await addVerificationCode(uuid);
      await sendEmailRegistration(email, verificationCode);
    } catch (e) {
      console.error('Sendgrid error', e);
    }
  } catch (e) {
    next(e);
  }
}

module.exports = create;
