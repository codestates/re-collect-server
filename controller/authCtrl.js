const TokenMiddleware = require('../middleware/token');
const UserMiddleware = require('../middleware/user');
const nodemailer = require('nodemailer');
const { isValidPwd, makeRandomPwd } = require('../utils/password');
const crypto = require('crypto');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');


module.exports = {
  sendMail: async(req, res, next) => {
    const { email } = req.body;
    const isOurUser = await UserMiddleware.checkUser(email);
    const templateStr = fs.readFileSync(path.resolve('./view', 'reset-template.html')).toString('utf8')
    const template = handlebars.compile(templateStr, { noEscape: true })

    console.log('유저가 맞나요?',isOurUser);
    if(!isOurUser) {
      return res.status(401).json({ message: 'not our user' });
    }
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.google.com',
      port: 587,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        accessToken: process.env.GMAIL_ACCESS_TOKEN,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN
      },
    });

    const randomPassword = makeRandomPwd(6);
    const newSalt = crypto.randomBytes(64).toString('hex');
    const newPassword = crypto.pbkdf2Sync(randomPassword, newSalt, 10000, 64, 'sha512').toString('base64');
    
    let data = {
      email: req.body.email,
      password: randomPassword
    }

    const htmlToSend = template(data);

    const message = {
      from: process.env.GMAIL_USER,
      to: req.body.email,
      subject:'Recollect에서 알려드립니다',
      html: htmlToSend,
    }

    try {
        const isUpdated = await UserMiddleware.updatePwdAndSalt(email, newPassword, newSalt);
        if(isUpdated) {
        return  transporter.sendMail(message, (err, info) => {
          if(err) {
              new(new Error(err));
            } else {
              console.log('-----이메일을 전송하였습니다------', info);
              return res.status(200).json({ message: 'ok' });
            }
          });
          }
        } catch(err) {
        next(new Error('failed'));
      }
  },
  resetPwd: async(req, res, next) => {
    const { tempPwd, pwd } = req.body;
    console
    const email  = req.query.email;
    if(!isValidPwd(pwd)){
      return res.status(422).json({ message: 'incorrect information' });
    }
    try {
      const result = await UserMiddleware.getPwd(email);
      const dbSalt = result.salt;
      const dbPwd = result.pwd;
      const hashedPwd =  crypto.pbkdf2Sync(tempPwd, dbSalt, 10000, 64, 'sha512').toString('base64');
      console.log('--------------------------------------compare hash------------------------------------------------------------------------------------'
      ,hashedPwd);
      console.log(dbPwd, '----------------------------------------');
      if( hashedPwd !== dbPwd ) {
        return res.status(401).json({ message : 'invalid temp password' });
      }
      const newPassword = crypto.pbkdf2Sync(pwd, dbSalt, 10000, 64, 'sha512').toString('base64');
      const isUpdated = await UserMiddleware.resetPwd(email, newPassword);
      if(isUpdated) {
        return res.status(200).json({ message: 'ok' });
      } 
    } catch(err) {
      next(new Error('failed'));
    }
  },
  checkUsername: async(req, res, next) => {
    const { username } = req.body;
    console.log('바디 값을 확인합니다',username);
    if(!username) {
      return res.status(422).json({ message: 'incorrect information' });
    }
    try {
      const isTaken = await UserMiddleware.checkUsername(username);
      if(!isTaken) {
        return res.status(200).json({ message: 'valid username' });
      } else {
        return  res.status(409).json({ message: 'already exists' });
      }
    } catch(err) {
      next(new Error('failed'));
    }
  },
  checkEmail: async(req, res, next) => {
    const { email } = req.body;
    if(!email) {
      return res.status(422).json({ message: 'incorrect information' });
    }
    try{
      const isTaken = await UserMiddleware.checkUser(email);
      console.log('사용가능합니까?', isTaken);
      if(!isTaken){
        return res.status(200).json({ message: 'valid email' });
      } else {
        return res.status(409).json({ message: 'already exist' });
      }
    } catch(err) {
      next(new Error('failed'));
    }
  },
  renewToken: async(req, res, next) => {
    const refreshTokenData = TokenMiddleware.checkRefreshToken(req.cookies.refreshToken);
    console.log('리프레쉬토큰을 확인합니다',refreshTokenData);
    if(!refreshTokenData) {
      return res.status(401).send('invalid refresh token');
    }
    try {
      const user = await UserMiddleware.findUser(refreshTokenData.email);
      if(!user) {
        throw Error;
      }
      const accessToken = TokenMiddleware.generateAccessToken(user);
      return TokenMiddleware.resendAccessToken(res, accessToken);
    } catch {
      next(new Error('failed'));
    }
  }
}
