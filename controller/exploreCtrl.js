const UserMiddleware = require('../middleware/user');

module.exports = {
  sendRandomUser: async(req, res, next) => {
    try {
      const users = await UserMiddleware.getRandomUser();
      return res.status(200).json({ users, message: 'welcome to explore' });
    } catch(err) {
      next(new Error('failed'));
    }
  }
}