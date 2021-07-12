const TokenMiddleware = require('../middleware/token');
const UserMiddleware = require('../middleware/user');
const crypto = require('crypto');

module.exports = {
  login: async(req, res, next) => {
    const { pwd, email } = req.body;
    const accessTokenData = TokenMiddleware.verifyToken(req);
    if(accessTokenData) {
      return res.status(409).json({ message: 'already logged in' });
    }
    if( pwd === undefined || email === undefined ) {
      return res.status(422).json({ message: 'incorrect information'});
    } else {
      const userInfo =  await UserMiddleware.getPwd(email);
      const dbPwd = userInfo.pwd;
      const dbSalt = userInfo.salt;
      let hashedPwd =  crypto.pbkdf2Sync(pwd, dbSalt, 10000, 64, 'sha512').toString('base64');
      console.log('--------------------------------------compare hash-----------------------------------------------------------'
        ,hashedPwd);
      console.log(dbPwd, '                     --------------------------------------------------------------------------------------------------------------');
      if( hashedPwd !== dbPwd ) {
        return res.status(401).json({ message: 'login failed' });
      } else {
        try {
          const user = await UserMiddleware.findUser(email);
          const accessToken = TokenMiddleware.generateAccessToken(user);
          const refreshToken = TokenMiddleware.generateAccessToken(user);
          const cookieOptions = {
            httpOnly: true,
            maxAge: 24 * 6 * 60 * 10000,
            secure: true,
            sameSite: 'none'
          }
          res.cookie('refreshToken', refreshToken, cookieOptions);
          res.setHeader('authorization', `Bearer ${accessToken}`);
          return res.status(200).json({ message: 'login successfully '});
        } catch(err) {
          console.error(err);
          next(new Error('failed'));
        }
      }
    }
  },

  logout: async(req, res, next) => {
    const accessTokenData = TokenMiddleware.verifyToken(req);
    if(!accessTokenData) {
      res.cookie('refreshToken', '');
      return res.status(401).json({ message: 'invalid access token' });
    }
    res.setHeader('authorization', '');
    res.cookie('refreshToken', '');
    return res.status(205).json({ message: 'logout successfully' });
  },

  signup: async(req, res) => {
    const { pwd, email, username } = req.body;
    if( email === undefined || username === undefined || pwd === undefined ) {
      return res.status(422).json({ message: 'incorrect information' });
    }
    const newSalt = crypto.randomBytes(64).toString('hex');
    const newPassword = crypto.pbkdf2Sync(pwd, newSalt, 10000, 64, 'sha512').toString('base64');
    try {
      const isCreated = await UserMiddleware.save(email, username, newPassword, newSalt);
      if(!isCreated) {
        return res.status(409).json({ message: 'already exists' });
      }
      return res.status(200).json({ message: 'sign up successfully'});
    } catch(err) {
      console.error(err);
      res.status(501).json({message: 'failed'});
    }
  }
}