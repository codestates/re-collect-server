"use strict";

const { Category, sequelize } = require('../models');

class CategoryMiddleware {
  static async getAll(userId) {
    // SELECT * FROM Categories WHERE userId = ?
    try {
      const categories = await Category.findAll({
        where: { userId },
        attributes: ['id', 'title']
      });
      const result = categories.map((el) => el.dataValues);
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

  static async update(userId, listId, title) {
    try {
      const result = await sequelize.transaction(async (t) => {
        return await Category.update({
          title
        }, {
          where: {
            userId,
            id: listId
          },
          transaction: t
        });
      });
      console.log('업데이트 결과확인', result);
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
      console.log('삭제확인', result);
      return Boolean(result);
    } catch (err) {
      console.log("---------------------------------Error occurred in category Middleware---------------------------------",
    err,
    "---------------------------------Error occurred in category Middleware---------------------------------"
    ); 
    }
  }
}

module.exports =  CategoryMiddleware;
