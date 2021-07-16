"use strict";

const { Category, sequelize } = require('../models');

class CategoryMiddleware {
  static async getAll(userId) {
    console.log(userId);
    // SELECT * FROM Categories WHERE userId = ?
    try {
      const categories = await Category.findAll({
        where: {
          userId: userId
        },
        attributes: ['id', 'title']
      });
      const result = categories.map((el) => el.dataValues);
      console.log(result);
      return result;
    } catch(err) {
      throw err;
    }
  }

  static async save(userId, title) {
    // sql = INSET INTO Categories (userId, title) VALUES (?,?)
    try {
      const [result, created] = await sequelize.transaction(async (t) => {
        return await Category.findOrCreate({
          where: { title, userId },
          defaults: {
          userId,
          title
        },
        transaction: t
        });
      });
      console.log('결과확인', result.dataValues);
      return result.dataValues.id;
    } catch(err) {
      console.log("---------------------------------Error occurred in category Middleware---------------------------------",
    err,
    "---------------------------------Error occurred in category Middleware---------------------------------"
    );
    }
  }

  static async findOneBy(title, userId) {
    try {
      const result = await sequelize.transaction(async (t) => {
        return await Category.findAll({
          where: {
            title:title,
            userId:userId
          },
          transaction: t,
          attributes: ['title']
        });
      });
      console.log(result);
      if(result.length === 0 || result === null) {
        return true;
      } else {
        return false;
      }
    } catch(err) {
      console.log("---------------------------------Error occurred in category Middleware---------------------------------",
    err,
    "---------------------------------Error occurred in category Middleware---------------------------------"
    );
    }
  }

  static async update(userId, categoryId, title) {
    try {
      const sql = `UPDATE Categories SET title = '${title}' WHERE userId = ${userId} AND id = ${categoryId};`;
      const result = await sequelize.transaction(async (t) => {
     	return await sequelize.query(sql, { transaction: t }); 
      });
      console.log('결과확인', result);
      console.log('업데이트 결과확인', Boolean(result));
      return Boolean(result[0]);
    } catch(err) {
      console.log("---------------------------------Error occurred in category Middleware---------------------------------",
    err,
    "---------------------------------Error occurred in category Middleware---------------------------------"
    );
    }
  }

  static async delete(userId, categoryId) {
    //sql = DELETE FROM Categories WHERE userId = ? AND id= ?
    try {
      const result = await sequelize.transaction(async (t) => {
        return await Category.destroy({
          where: {
            id: categoryId,
            userId,
          }
        });
      });
      console.log('삭제확인', Boolean(result[0]));
      return Boolean(result[0]);
    } catch (err) {
      console.log("---------------------------------Error occurred in category Middleware---------------------------------",
    err,
    "---------------------------------Error occurred in category Middleware---------------------------------"
    );
    }
  }
}

module.exports =  CategoryMiddleware;
