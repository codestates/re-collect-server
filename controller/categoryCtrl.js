const CategoryMiddleware = require('../middleware/category');
const TokenMiddleware = require('../middleware/token');

module.exports = {
  edit: async(req, res, next) => {
    const { id, title } = req.body;
    const accessTokenData = TokenMiddleware.verifyToken(req);
    console.log('엑세스토큰을 확인합니다', accessTokenData);
    if(!accessTokenData) {
      return res.status(401).json({ message: "invalid access token"});
    }
    if( title === undefined || title === '' || id === undefined || id === '' ) {
      return res.status(422).json({ message: 'incorrect information' });
    }
    try {
      console.log(accessTokenData.id);
      const isNew = await CategoryMiddleware.findOneBy(title, accessTokenData.id);
      console.log('새로운 타이틀입니까?', isNew);
      if(isNew) {
        return res.status(422).json({ message: 'already exists' });
      }
      const isUpdated = await CategoryMiddleware.update(accessTokenData.id, id, title);
      console.log('업데이트 되었습니까?', isUpdated);
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
