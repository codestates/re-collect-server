const BookmarkMiddleware = require('../middleware/bookmark');
const CategoryMiddleware = require('../middleware/category');
const TokenMiddleware = require('../middleware/token');

module.exports = {
  create: async(req, res) => {
    const accessTokenData = TokenMiddleware.verifyToken(req);
    const { category, text, url, importance, color } = req.body;
    if(!accessTokenData) {
      return res.status(401).json({ message: 'invalid access token' });
    }
    try {
      await CategoryMiddleware.save(accessTokenData.id, category)
      .then(async(result) => {
        const categoryId = result;
        let position = await BookmarkMiddleware.findRecentPosition(accessTokenData.id);
            position = position ? position + 1 : 1;
        const isCreated = BookmarkMiddleware.save(accessTokenData.id, categoryId, position, text, url, importance, color);
        if(isCreated) {
          return res.status(200).json({ message: 'created successfully' });
        }
      })
    } catch(err) {
      console.error(err);
      return res.status(501).json({ message: 'failed' });
    }
  },
  edit: async(req, res, next) => {
    const accessTokenData = TokenMiddleware.verifyToken(req);
    const { color, importance, url, text } = req.body;
    const id = req.params.id;
    if(!accessTokenData) {
      return res.status(401).json({ message: 'invalid access token' });
    }
    try{
      const isEdited = await BookmarkMiddleware.update(id, text, url, importance, color);
      if(isEdited) {
        return res.status(200).json({ message: 'edited successfully '});
      } 
    } catch(err) {
      return res.status(501).json({ message: 'failed' });
    }
  },
  updateOnePosition: async(req, res) => {
    const accessTokenData = TokenMiddleware.verifyToken(req);
    const { categoryId } = req.body;
    const id = req.params.id;
    if(!accessTokenData) {
      return res.status(401).json({ message: 'invalid access token' });
    } 
    try {
      let position = await BookmarkMiddleware.findRecentPosition(accessTokenData.id);
        position = position ? position + 1 : 1;
      const isUpdated = await BookmarkMiddleware.addOneToPosition(id, categoryId, position);
      if (isUpdated) {
        return res.status(200).json({ message: 'ok' });
      }
    } catch(err) {
      return res.status(501).json({ message: 'failed' });
    }
  },
  updateAllPosition: async(req, res, next) => {
    const accessTokenData = TokenMiddleware.verifyToken(req);
    const { categoryId } =  req.body;
    const { dragId, dropId } = req.params;
    if(!accessTokenData) {
      return res.status(401).json({ message: 'invalid access token' });
    } 
    try {
      const position = await BookmarkMiddleware.findPositionById(dropId);
      if( position ) {
        let isUpdated = await BookmarkMiddleware.addOnePositionBiggerThan(categoryId, position);
        if(!isUpdated) {
          throw error;
        }
        isUpdated = await BookmarkMiddleware.updatePositionOf(dragId, categoryId, position);
        if(!isUpdated){
          throw error;
        }
        return res.status(200).json({ message: 'ok' });
      } else {
        throw error;
      }
    } catch(err) {
      next(new Error('failed'));
    }
  },
  destroy: async(req, res, next) => {
    const id = req.params.id;
    const accessTokenData = TokenMiddleware.verifyToken(req);
    if(!accessTokenData) {
      return res.status(401).json({ message: 'invalid access token' });
    }
    try {
      const isDeleted = await BookmarkMiddleware.delete(id);
      console.log(isDeleted);
      if(isDeleted){
        return res.status(200).json({ message: 'deleted successfully' });
      } 
    } catch(err) {
      next(new Error('failed'));
    }
  }
}