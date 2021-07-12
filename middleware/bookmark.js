"use strict";

const { Bookmark , sequelize, db } = require('../models');

class BookmarkMiddleware {
  static async findRecentPosition(userId) {
    //sql = SELECT position FROM Bookmarks ORDER BY position DESC LIMIT 1
    try {
      const bookmarks = await Bookmark.findAll({
        where: { userId },
        attributes: ['position'],
        order: [['position', 'DESC']],
      }, { limit: 1 });
      if( bookmarks.length === 0 ) {
        return 0;
      } else {
        return bookmarks[0]['position'];
      }
    } catch(err) {
      console.log("---------------------------------Error occurred in bookmark Middleware---------------------------------",
      err,
      "---------------------------------Error occurred in bookmark Middleware---------------------------------");
    }
  }

  static async findPositionById(id) {
    //sql = SELECT position FROM Bookmarks WHERE id=?
    try {
      const result = await Bookmark.findOne({
        attributes: ['position'],
        where: {
          id
        }
      });
      if( result === null ){
        return 0;
      }
      return result.dataValues.position;
    } catch(err) {
      console.log("---------------------------------Error occurred in bookmark Middleware---------------------------------",
      err,
      "---------------------------------Error occurred in bookmark Middleware---------------------------------");
    }
  }

  static async getAll(userId) {
    //sql = SELECT * FROM Bookmarks ORDER BY position 
    try {
      const bookmarks = await Bookmark.findAll({
        where: { userId }
      });
      const result = bookmarks.map((el) => el.dataValues);
      return result;
    } catch(err) {
      console.log("---------------------------------Error occurred in bookmark Middleware---------------------------------",
      err,
      "---------------------------------Error occurred in bookmark Middleware---------------------------------");
    }
  }

  static async save(userId, categoryId, position, text, url, importance, color) {
    //sql = INSERT INTO Bookmarks (userId, categoryId, position, text, url, importance, color)
    console.log('실행한 것을 확인합니다');
    try {
      const result = await sequelize.transaction(async (t) => {
        return await Bookmark.create({
          userId,
          categoryId,
          position,
          text,
          url,
          importance,
          color
        }, { transaction: t });
      });
      console.log('저장확인', result);
      return Boolean(result);
    } catch(err) {
      console.log("---------------------------------Error occurred in bookmark Middleware---------------------------------",
      err,
      "---------------------------------Error occurred in bookmark Middleware---------------------------------");
    }
  }

  static async update(id, text, url, importance, color) {
    //sql = UPDATE Bookmarks SET url=?, importance=?, color=?
    try {
      const result = sequelize.transaction(async (t) => {
        return await Bookmark.update({
          text,
          url,
          importance,
          color
        }, {
          where: { id },
          transaction: t
        });
      });
      console.log('수정확인', result);
      return Boolean(result);
    } catch(err) {
      console.log("---------------------------------Error occurred in bookmark Middleware---------------------------------",
      err,
      "---------------------------------Error occurred in bookmark Middleware---------------------------------");
    }
  }

  static async updatePositionOf(id, categoryId, position) {
    //sql = UPDATE Bookmarks SET categoryId=?, position=? WHERE id=?
    try {
      const result = await sequelize.transaction(async (t) => {
        return await Bookmark.update({
          categoryId,
          position
        }, {
          where: { id },
          transaction: t
        });
      });
      console.log('카드 위치 변경 확인', result);
      return Boolean(result[0]);
    } catch (err) {
      console.log("---------------------------------Error occurred in bookmark Middleware---------------------------------",
      err,
      "---------------------------------Error occurred in bookmark Middleware---------------------------------");
    }
  }

  static async addOneToPosition(id, categoryId, position) {
    //sql = UPDATE Bookmarks SET categoryId=?, position=? WHERE id=? 
    try {
      const result = await sequelize.transaction(async (t) => {
        return await Bookmark.update({
          categoryId,
          position
        }, {
          where: { id },
          transaction: t
        });
      });
      console.log('확인 작업', result);
      return Boolean(result);
    } catch(err) {
      console.log("---------------------------------Error occurred in bookmark Middleware---------------------------------",
      err,
      "---------------------------------Error occurred in bookmark Middleware---------------------------------");
    }
  }

  static async addOnePositionBiggerThan(categoryId, position) {
    //sql = UPDATE Bookmarks SET position=position+1 WHERE categoryId=? AND position >= ?
    try {
      const sql = `UPDATE Bookmarks SET position=position+1 WHERE categoryId=${categoryId} AND position >= ${position}`;
      const [results, metadata] = await sequelize.transaction(async (t) => {
        return await sequelize.query(sql, {transaction: t });
      });
      console.log('업데이트 성공했나요?', Boolean(metadata));
      console.log('결과물: ', results);
      return Boolean(metadata);
    } catch(err) {
      console.log("---------------------------------Error occurred in bookmark Middleware---------------------------------",
      err,
      "---------------------------------Error occurred in bookmark Middleware---------------------------------");
      return false;
    }
  }

  static async delete(id) {
    //sql = DELETE FROM Bookmarks WHERE id=?
    try {
      const result = await sequelize.transaction(async (t) => {
        return await Bookmark.destroy({
          where: { id },
          transaction: t
        });
      });
      return Boolean(result);
    } catch(err) {
      console.log("---------------------------------Error occurred in bookmark Middleware---------------------------------",
      err,
      "---------------------------------Error occurred in bookmark Middleware---------------------------------");
    }
  }
}

module.exports = BookmarkMiddleware;