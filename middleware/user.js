"use strict";
const { User , sequelize, db } = require('../models');

class UserMiddleware {
  static async findUser(email) {
    try {
      const user = await User.findOne({
        attributes: ['id', 'username', 'email', 'gitRepo', 'company', 'createdAt', 'updatedAt'],
        where: { email }
      });
      return user.dataValues;
    } catch(err) {
      console.log("---------------------------------Error occurred in User Middleware---------------------------------",
      err,
      "---------------------------------Error occurred in User Middleware---------------------------------");
    }
  }

  static async getPwd(email) {
    try {
      const user = await User.findOne({
        attributes: ['pwd', 'salt'],
        where: { email }
      });
      return user.dataValues;
    } catch(err) {
      return null;
    }
  }

  static async save(email, username, pwd, salt) {
    try {
      const [result , created] = await User.findOrCreate({
        where: { email },
        defaults: {
          username,
          email,
          pwd,
          salt
        }
      });
      console.log(result);
      return created;
  } catch(err) {
    console.log("---------------------------------Error occurred in User Middleware---------------------------------",
    err,
    "---------------------------------Error occurred in User Middleware---------------------------------");
    }
  }


}

module.exports = UserMiddleware;