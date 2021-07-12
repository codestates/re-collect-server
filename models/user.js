'use strict';
const { Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
      User.hasMany(models.Category, { foreignKey: 'userId' });
      User.hasMany(models.Bookmark, { foreignKey: 'userId' });
    }
  };
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    pwd: DataTypes.TEXT,
    salt: DataTypes.TEXT,
    gitRepo: DataTypes.STRING,
    company: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};