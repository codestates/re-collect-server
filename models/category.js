'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {

    static associate(models) {
      Category.hasMany(models.Bookmark, {
        foreignKey: 'categoryId',
      });
      Category.belongsTo(models.User, {
        onDelete: 'CASCADE',
        foreignKey: 'userId'
      });

    }
  };
  Category.init({
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};