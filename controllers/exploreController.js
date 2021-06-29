const { Users, Bookmarks } = require('../models');
const sequelize = require('sequelize');

module.exports = {
  sendRandomUsers: async(req, res) => {
    await Users.findAll({
      attributes: [ 'id', 'username', 'email', 'gitRepo', 'company', 'createdAt', 'updatedAt' ],
      order: [sequelize.fn('RAND')],
      limit: 4
    })
    .then((result) => {
      console.log(result);
      const users = result.map((el) => {
        return el.dataValues;
      });
      return res.status(200).json({ users, message: 'welcome to explore' });
    })
    .catch((err) => {
      return res.status(500).json({ message: 'failed' });
    })
  }
}