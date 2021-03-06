"use strict";

const { Category, Bookmark , sequelize, db } = require('../models');


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
      throw Error;
    }
  }

  static async findPositionById(id) {
    //sql = SELECT position FROM Bookmarks WHERE id=?
    try {
      console.log(id);
      const result = await Bookmark.findAll({
        where: { id },
        attributes: ['position']
      });
      console.log(result[0]);
      if( result === null ){
        return 0;
      }
      if( result.length !== 0 ){
        return result[0].dataValues.position;
      }
    } catch(err) {
      console.log("---------------------------------Error occurred in bookmark Middleware---------------------------------",
      err,
      "---------------------------------Error occurred in bookmark Middleware---------------------------------");
      throw Error;
    }
  }

  static async findById(id) {
    //sql = SELECT id FROM Bookmarks WHERE id=?
    try {
      console.log(id);
      const result = await sequelize.transaction(async (t) => {
        return await Bookmark.findAll({
          where: {
            id: id
          },
          transaction: t,
          attributes: ['id']
        });
      });
      if( result.length !== 0 ){
        if(result[0].dataValues.id == id) {
        return true;
        } else {
        return false;
        }
      }
    } catch(err) {
      console.log("---------------------------------Error occurred in bookmark Middleware---------------------------------",
      err,
      "---------------------------------Error occurred in bookmark Middleware---------------------------------");
      throw Error;
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
      throw Error;
    }
  }

  static async checkCategory(id, category){
    try {
      const result = await sequelize.transaction(async (t) => {
        const categoryId =  await Bookmark.findAll({
          where: { id },
          transaction: t,
          attributes: ['categoryId']
        }).then((res) => res[0].dataValues.categoryId );
        const categoryTitle = await Category.findAll({
          where: { id: categoryId },
          transaction: t,
          attributes: ['title']
        }).then((res) => res[0].dataValues.title );
        console.log('????????? ???????????????: ',category, ' ?????? ???????????? ?????????: ',categoryId, '?????? ???????????????: ',categoryTitle);
        if (category === categoryTitle ){
          return { isDifferent:false, id:categoryId };
        } else {
          return { isDifferent:true, id: null };
        }
      });
      return result;
    } catch(err) {
      console.log("---------------------------------Error occurred in bookmark Middleware---------------------------------",
      err,
      "---------------------------------Error occurred in bookmark Middleware---------------------------------");
      throw Error;
    }
  }

  static async save(userId, categoryId, position, text, url, importance, color) {
    //sql = INSERT INTO Bookmarks (userId, categoryId, position, text, url, importance, color)
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
      console.log('????????????', Boolean(result[0]));
      return Boolean(result[0]);
    } catch(err) {
      console.log("---------------------------------Error occurred in bookmark Middleware---------------------------------",
      err,
      "---------------------------------Error occurred in bookmark Middleware---------------------------------");
      throw Error;
    }
  }

  static async update(id, text, url, importance, color) {
    //sql = UPDATE Bookmarks SET url=?, importance=?, color=?
    try {
      const result = await sequelize.transaction(async (t) => {
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
      console.log('????????????', Boolean(result[0]));
      return Boolean(result[0]);
    } catch(err) {
      console.log("---------------------------------Error occurred in bookmark Middleware---------------------------------",
      err,
      "---------------------------------Error occurred in bookmark Middleware---------------------------------");
      throw Error;
    }
  }

  static async updateAll(categoryId, id, text, url, importance, color) {
    //sql = UPDATE Bookmarks SET url=?, importance=?, color=?
    try {
      const result = await sequelize.transaction(async (t) => {
        return await Bookmark.update({
          categoryId,
          text,
          url,
          importance,
          color
        }, {
          where: { id },
          transaction: t
        });
      });
      console.log('????????????', Boolean(result[0]));
      return Boolean(result[0]);
    } catch(err) {
      console.log("---------------------------------Error occurred in bookmark Middleware---------------------------------",
      err,
      "---------------------------------Error occurred in bookmark Middleware---------------------------------");
      throw Error;
    }
  }

  static async updateVisitCountsOf(id) {
    //sql = UPDATE Bookmarks SET visitCounts=visitCounts+1 WHERE id=?
    const sql = `UPDATE Bookmarks SET visitCounts=visitCounts+1 WHERE id=${id};`;
    try {
      const [results, metadata] = await sequelize.transaction(async (t) => {
        return await sequelize.query(sql, { transaction: t });
      });
      console.log(`?????? ?????? ??????`, Boolean(metadata.affectedRows));
      return Boolean(metadata.affectedRows);
  } catch(err) {
    console.log("---------------------------------Error occurred in bookmark Middleware---------------------------------",
      err,
      "---------------------------------Error occurred in bookmark Middleware---------------------------------");
      throw Error;
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
      console.log('?????? ?????? ?????? ??????', result);
      return Boolean(result[0]);
    } catch (err) {
      console.log("---------------------------------Error occurred in bookmark Middleware---------------------------------",
      err,
      "---------------------------------Error occurred in bookmark Middleware---------------------------------");
      throw Error;
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
      console.log('???????????? ?????? ??????:  ', Boolean(result[0]));
      return Boolean(result[0]);
    } catch(err) {
      console.log("---------------------------------Error occurred in bookmark Middleware---------------------------------",
      err,
      "---------------------------------Error occurred in bookmark Middleware---------------------------------");
      throw Error;
    }
  }

  static async addOnePositionBiggerThan(categoryId, position) {
    //sql = UPDATE Bookmarks SET position=position+1 WHERE categoryId=? AND position >= ?
    try {
      const sql = `UPDATE Bookmarks SET position=position+1 WHERE categoryId=${categoryId} AND position >= ${position}`;
      const [results, metadata] = await sequelize.transaction(async (t) => {
        return await sequelize.query(sql, {transaction: t });
      });
      console.log('???????????? ????????????????', Boolean(metadata));
      console.log('?????????: ', results);
      return Boolean(metadata);
    } catch(err) {
      console.log("---------------------------------Error occurred in bookmark Middleware---------------------------------",
      err,
      "---------------------------------Error occurred in bookmark Middleware---------------------------------");
      throw Error;
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
      console.log(result);
      console.log('?????? ??????: ', Boolean(result));
      return Boolean(result);
    } catch(err) {
      console.log("---------------------------------Error occurred in bookmark Middleware---------------------------------",
      err,
      "---------------------------------Error occurred in bookmark Middleware---------------------------------");
      throw Error;
    }
  }
}

module.exports = BookmarkMiddleware;
