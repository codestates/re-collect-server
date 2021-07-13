"use strict";
const { User , sequelize, db } = require('../models');

class UserMiddleware {
  static async findUser(email) {
    console.log(email);
    try {
      const result = await User.findAll({
        where: {
          email: email
        },
        attributes: ['id', 'username', 'email', 'gitRepo', 'company', 'createdAt', 'updatedAt']
      });
      return result[0].dataValues;
    } catch(err) {
      console.log("---------------------------------Error occurred in User Middleware---------------------------------",
      err,
      "---------------------------------Error occurred in User Middleware---------------------------------");
      throw Error;
    }
  }

  static async getRandomUser() {
    try {
      const result = await User.findAll({
        attributes: [ 'id', 'username', 'email', 'gitRepo', 'company', 'createdAt', 'updatedAt' ],
        order: [sequelize.fn('RAND')],
        limit:10
      }).then((users) => {
        return users.map((user) => user.dataValues);
      });
      return result;
    } catch(err) {
      console.log("---------------------------------Error occurred in User Middleware---------------------------------",
      err,
      "---------------------------------Error occurred in User Middleware---------------------------------");
      throw Error;
    }
  }

  static async checkUser(email) {
    try {
      const result = await User.findOne({
        where: { email }
      });
      if(result === null){
        return false;
      } else {
        return(result.dataValues.email === email);
      }
    } catch(err) {
      throw error;
    }
  }
  static async checkUsername(username) {
    try {
      const result = await User.findOne({
        attributes: ['username'],
        where: { username: username }
      });
      if(result === null ){
        return false;
      } else {
        return (result.dataValues.username === username )
      }
    } catch(err) {
      console.log("---------------------------------Error occurred in User Middleware---------------------------------",
      err,
      "---------------------------------Error occurred in User Middleware---------------------------------");
      throw Error;
    }
  }
  static async getPwd(email) {
    try {
      //sql = `SELECT Users.pwd, Users.salt FROM Users WHERE Users.email = '${email}';`;
      const result = await sequelize.transaction(async (t) => {
        return await User.findAll({
          where: {
            email: email
          },
          attributes: ['pwd', 'salt']
        });
      });
      return result[0].dataValues;
    } catch(err) {
      console.log("---------------------------------Error occurred in User Middleware---------------------------------",
      err,
      "---------------------------------Error occurred in User Middleware---------------------------------");
      throw Error;
    }
  }

  static async updatePwdAndSalt(email, pwd, salt) {
    try {
      const result = await sequelize.transaction(async (t) => {
        return User.update({
          pwd: pwd,
          salt: salt
        }, {
          where: { email },
          transaction: t
        });
      });
      return Boolean(result);
    } catch(err) {
      console.error(err);
      return false;
    }
  }

  static async resetPwd(email, pwd) {
    console.log(email, ' ', pwd);
    try {
      const result = await sequelize.transaction(async (t) => {
        return await User.update({
          pwd: pwd
        }, {
          where: { email },
          transaction: t
        });
      });
      console.log(result);
      return Boolean(result[0]);
    } catch(err) {
      console.log("---------------------------------Error occurred in User Middleware---------------------------------",
      err,
      "---------------------------------Error occurred in User Middleware---------------------------------");
      throw Error;
    }
  }

  static async changeUsername(id, username) {
    try {
      const result = await sequelize.transaction(async (t) => {
        return User.update({
          username
        }, {
          where: { id: id },
          transaction: t
        });
      });
      console.log('유저네임 변경 확인', result);
      return Boolean(result);
    } catch(err) {
      console.log("---------------------------------Error occurred in User Middleware---------------------------------",
      err,
      "---------------------------------Error occurred in User Middleware---------------------------------");
      throw Error;
    }
  }

  static async changeCompany(id, company) {
    try {
      const result = await sequelize.transaction(async (t) => {
        return User.update({
          company
        }, {
          where: { id: id },
          transaction: t
        });
      });
      console.log('회사명 변경 확인', result);
      return Boolean(result);
    } catch(err) {
      console.log("---------------------------------Error occurred in User Middleware---------------------------------",
      err,
      "---------------------------------Error occurred in User Middleware---------------------------------");
      return false;
    }
  }

  static async changeGitRepo(id, gitRepo) {
    try {
      const result = await sequelize.transaction(async (t) => {
        return User.update({
          gitRepo: gitRepo
        }, {
          where: { id: id },
          transaction: t
        });
      });
      console.log('깃레포 변경 확인', result);
      return Boolean(result);
    } catch(err) {
      console.log("---------------------------------Error occurred in User Middleware---------------------------------",
      err,
      "---------------------------------Error occurred in User Middleware---------------------------------");
      return false;
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
      console.log(created);
      return created;
  } catch(err) {
    console.log("---------------------------------Error occurred in User Middleware---------------------------------",
    err,
    "---------------------------------Error occurred in User Middleware---------------------------------");
    throw Error;
    }
  }

  static async delete(email) {
    try {
      const result = sequelize.transaction(async (t) => {
        return await User.destroy({
          where: { email }
        });
      });
      console.log('삭제확인:', result);
      return Boolean(result);
    } catch(err) {
      console.log("---------------------------------Error occurred in User Middleware---------------------------------",
    err,
    "---------------------------------Error occurred in User Middleware---------------------------------");
      return false;
    }
  }

}

module.exports = UserMiddleware;