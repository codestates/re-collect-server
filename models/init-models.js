var DataTypes = require("sequelize").DataTypes;
var _Bookmarks = require("./Bookmarks");
var _SequelizeMeta = require("./SequelizeMeta");
var _Users = require("./Users");

function initModels(sequelize) {
  var Bookmarks = _Bookmarks(sequelize, DataTypes);
  var SequelizeMeta = _SequelizeMeta(sequelize, DataTypes);
  var Users = _Users(sequelize, DataTypes);

  Bookmarks.belongsTo(Users, { as: "user", foreignKey: "userId"});
  Users.hasMany(Bookmarks, { as: "Bookmarks", foreignKey: "userId"});

  return {
    Bookmarks,
    SequelizeMeta,
    Users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
