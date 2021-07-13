const UserMiddleware = require('../middleware/user');
const BookmarkMiddleware = require('../middleware/bookmark');
const TokenMiddleware = require('../middleware/token');
const { isValidPwd } = require('../utils/password');
const crypto = require('crypto');

module.exports = {
  getProfile: async(req, res, next) => {
    const accessTokenData = TokenMiddleware.verifyToken(req);
    if(!accessTokenData){
      return res.status(401).json({ message: 'invalid access token' });
    }
    try {
      console.log(accessTokenData);
      const user = await UserMiddleware.findUser(accessTokenData.email);
      console.log(user);
      const bookmark = await BookmarkMiddleware.getAll(accessTokenData.id);
      if(user && bookmark) {
        return res.status(200).json({ user, bookmark, message: 'get profile successfully' });
      } else {
        throw error;
      }
    } catch(err) {
      next(new Error('failed'));
    }
  },
  changeUsername: async(req, res, next) => {
    const accessTokenData = TokenMiddleware.verifyToken(req);
    const { username } = req.body;
    if(!accessTokenData) {
      return res.status(401).json({ message: 'invalid access token' });
    }
    try {
      const isUsed = await UserMiddleware.checkUsername(username);
      if(isUsed) {
        return res.status(409).json({ message: 'already exist '});
      }
      const isUpdated = await UserMiddleware.changeUsername(accessTokenData.id, username);
      if(!isUpdated){
        throw Error;
      }
      return res.status(200).json({ message: 'edited successfully' });
    } catch(err) {
      next(new Error('failed'));
    }
  },
  changePwd: async(req, res, next) => {
    const accessTokenData = TokenMiddleware.verifyToken(req);
    const { pwd, newPwd } = req.body;
    if(!accessTokenData) {
      return res.status(401).json({ message: 'invalid access token' });
    } 
    if(!isValidPwd(newPwd)){
      return res.status(422).json({ message: 'incorrect information' });
    }
    try {
      const result = await UserMiddleware.getPwd(accessTokenData.email);
      console.log('결과확인', result);
      const dbPwd = result.pwd;
      const dbSalt = result.salt;
      const hashedPwd =  crypto.pbkdf2Sync(pwd, dbSalt, 10000, 64, 'sha512').toString('base64');
      if(dbPwd !== hashedPwd ) {
        return res.status(422).json({ message: 'incorrect information' });
      }
      const newPassword = crypto.pbkdf2Sync(newPwd, dbSalt, 10000, 64, 'sha512').toString('base64');
      if(newPassword === hashedPwd){
        return res.status(422).json({ message: 'cannot change with the same password' });
      }
      const isUpdated = await UserMiddleware.resetPwd(accessTokenData.email, newPassword);
      console.log(isUpdated);
      if(!isUpdated){
        throw Error; 
      } 
      return res.status(200).json({ message: 'edited successfully' });
    } catch(err) {
      next(new Error('failed'));
    }
  },
  changeGitrepo: async(req, res, next) => {
    const accessTokenData = TokenMiddleware.verifyToken(req);
    const { gitrepo } = req.body;
    if(!accessTokenData) {
      return res.status(401).json({ message: 'invalid access token' });
    }
    try {
      const isUpdated = await UserMiddleware.changeGitRepo(accessTokenData.id, gitrepo);
      if(!isUpdated){
        throw Error;
      }
      return res.status(200).json({ message: 'edited successfully' });
    } catch(err) {
      next(new Error('failed'));
    }
  },
  changeCompany: async(req, res, next) => {
    const accessTokenData = TokenMiddleware.verifyToken(req);
    const { company } = req.body;
    if(!accessTokenData) {
      return res.status(401).json({ message: 'invalid access token' });
    }
    try {
      const isUpdated = await UserMiddleware.changeCompany(accessTokenData.id, company);
      if(!isUpdated){
        throw Error;
      }
      return res.status(200).json({ message: 'edited successfully' });
    } catch(err) {
      next(new Error('failed'));
    }
  },
  deleteAccount: async(req, res, next) => {
    const accessTokenData = TokenMiddleware.verifyToken(req);
    if(!accessTokenData) {
      return res.status(401).json({ message: 'invalid access token' });
    }
    try {
      const isDeleted = await UserMiddleware.delete(accessTokenData.email);
      if(!isDeleted){
        throw Error;
      } 
      return res.status(200).json({ message: 'deleted successfully' });
    } catch(err) {
      next(new Error('failed'));
    }
  }
}