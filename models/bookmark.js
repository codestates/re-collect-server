'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bookmark extends Model {

    static associate(models) {
      Bookmark.belongsTo(models.Category, {
        onDelete: 'CASCADE',
        foreignKey: 'categoryId',
      });
      Bookmark.belongsTo(models.User, {
        onDelete: 'CASCADE',
        foreignKey: 'userId'
      });
    }
  };
  Bookmark.init({
    userId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
    position: DataTypes.INTEGER,
    text: DataTypes.TEXT,
    url: DataTypes.STRING,
    importance: DataTypes.TINYINT,
    color: DataTypes.TEXT,
    visitCounts: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Bookmark',
  });
  return Bookmark;
};