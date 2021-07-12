const CategoryMiddleware = require('../middleware/category');
const TokenMiddleware = require('../middleware/token');

module.exports = {
  edit: async(req, res, next) => {
    const { id, title } = req.body;
    const accessTokenData = TokenMiddleware.verifyToken(req);
    if(!accessTokenData) {
      return res.status(401).json({ message: "invalid access token"});
    } 
    try {
      const isUpdated = await CategoryMiddleware.update(accessTokenData.id, id, title);
      if(isUpdated) {
        return res.status(200).json({ message: 'ok '});
      }
    } catch(err) {
      next(new Error('failed'));
    }
  },
  destroy: async(req, res, next) => {
    const id = req.params.id;
    const accessTokenData = TokenMiddleware.verifyToken(req);
    if(!accessTokenData) {
      return res.status(401).json({ message: 'deleted successfully'});
    } 
    try {
      const isSuccess = await CategoryMiddleware.delete(accessTokenData.id, id);
      if(isSuccess) {
        return res.status(200).json({ message: 'deleted successfully'});
      } else {
        throw error;
      }
    } catch(err) {
      next(new Error('failed'));
    }
  }
}