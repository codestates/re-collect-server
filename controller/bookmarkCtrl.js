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
    if( category === "" || category === null ) {
      return res.status(422).json({ message: 'incorrect information' });
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
    console.log(req.headers['authorization']);
    const accessTokenData = TokenMiddleware.verifyToken(req);
    const { category, color, importance, url, text } = req.body;
    const id = req.params.id;
    if(!accessTokenData) {
      return res.status(401).json({ message: 'invalid access token' });
    }
    if(category === undefined) {
      console.log('--------------유저가 카테고리를 입력하지 않았습니다----------------');
      return res.status(422).json({ message: 'incorrect informaiton'});
    }
    try{
      const isExist = await BookmarkMiddleware.findById(id);
      console.log(isExist);
      if(!isExist) {
        return res.status(422).json({ message: 'incorrect information'})
      }
      const result = await BookmarkMiddleware.checkCategory(id, category);
      console.log(result);
      if(result['isDifferent']){
        await CategoryMiddleware.save(accessTokenData.id, category)
      .then(async(result) => {
        const categoryId = result;
        const isEdited = await BookmarkMiddleware.updateAll(categoryId, id, text, url, importance, color);
        if(isEdited) {
          return res.status(200).json({ message: 'edited successfully '});
        } else {
          return res.status(501).json({ message: 'failed' })
        }
      });
      } else {
        const isEdited = await BookmarkMiddleware.update(id, text, url, importance, color);
        if(isEdited) {
          return res.status(200).json({ message: 'edited successfully '});
        } else {
          return res.status(501).json({ message: 'failed' })
        }
      }
    } catch(err) {
      next(new Error('failed'));
    }
  },
  updateVisitCounts: async(req, res, next) => {
    const accessTokenData = TokenMiddleware.verifyToken(req);
    const id = req.params.id;
    console.log('엑세스 토큰을 확인합니다', accessTokenData);
    if(!accessTokenData) {
      return res.status(401).json({ message: 'invalid access token' });
    }
    try {
      const isExist = await BookmarkMiddleware.findById(id);
      if(!isExist) {
        return res.status(422).json({ message: 'incorrect information'})
      }
      const isUpdated = await BookmarkMiddleware.updateVisitCountsOf(id);
      if(isUpdated){
        return res.status(200).json({ message: 'ok '});
      }
    } catch(err) {
      next(new Error('failed'));
    }
  },
  updateOnePosition: async(req, res) => {
    const accessTokenData = TokenMiddleware.verifyToken(req);
    const { categoryId } = req.body;
    const id = req.params.id;
    console.log('엑세스토큰을 확인합니다',accessTokenData);
    if(!accessTokenData) {
      return res.status(401).json({ message: 'invalid access token' });
    }
    try {
      const isExist = await BookmarkMiddleware.findById(id);
      console.log('존재하는 북마크인가요?', isExist);
      if(!isExist) {
        return res.status(422).json({ message: 'incorrect information'});
      }
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
    console.log('엑세스 토큰을 확인합니다', accessTokenData);
    if(!accessTokenData) {
      return res.status(401).json({ message: 'invalid access token' });
    }
    try {
      const isDragExist = await BookmarkMiddleware.findById(dragId);
      const isDropExist = await BookmarkMiddleware.findById(dropId);
      console.log('drop된 북마크가 존재하나요?', isDropExist);
      console.log('drag된 북마크가 존재하나요?', isDragExist);
      if(!isDragExist || !isDropExist) {
       return res.status(422).json({ message: 'incorrect information' });
      }
      const position = await BookmarkMiddleware.findPositionById(dropId);
      console.log('drop된 북마크의 포지션을 확인합니다',position);
      if( position ) {
        let isUpdated = await BookmarkMiddleware.addOnePositionBiggerThan(categoryId, position);
        console.log(isUpdated);
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
      const isExist = await BookmarkMiddleware.findById(id);
      if(!isExist) {
        return res.status(422).json({ message: 'incorrect information' });
      }
      const isDeleted = await BookmarkMiddleware.delete(id);
      console.log('제거가 정말로 되었나요?', isDeleted);
      if(isDeleted){
        return res.status(200).json({ message: 'deleted successfully' });
      } else {
        throw Error;
      }
    } catch(err) {
      next(new Error('failed'));
    }
  }
}
