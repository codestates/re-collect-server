const { Users } = require('../models');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

require('dotenv').config();

const { generateAccessToken, generateRefreshToken, verifyToken, checkRefreshToken, resendAccessToken } = require('../utils/token');
const { isValidPwd, makeRandomPwd } = require('../utils/password');


module.exports = {
  //* POST /signup 
  signUpController: async(req, res) => {
    const { pwd, email, username } = req.body;

    if( email === undefined || username === undefined || pwd === undefined ) {
      return res.status(422).json({ message: 'incorrect information' });
    }

    let newSalt = crypto.randomBytes(64).toString('hex');
    let newPassword = crypto.pbkdf2Sync(pwd, newSalt, 10000, 64, 'sha512').toString('base64');
    
    await Users.findOrCreate({
      where: { email },
      defaults: {
        username: username,
        email: email,
        pwd: newPassword,
        salt: newSalt
      },
    })
    .then(([result, created]) => {
      if(!created) {
        return res.status(409).json({ message: 'already exists' });
      } 
      return res.status(200).json({ message: 'sign up successfully' });
    })
    .catch((err) => {
      res.status(501).json({ message: 'failed' });
      console.error(err);
    })
  },
  //* POST /login
  logInController: async(req, res) => {
    const { pwd, email } = req.body;
    if( pwd === undefined || email === undefined ) {
      return res.status(422).json({ message: 'incorrect information' });
    }
    await Users.findOne({
      where: { email: email }
    })
    .then((result) => {
      let dbPwd = result.dataValues.pwd;
      let dbSalt = result.dataValues.salt;
      let hashedPwd =  crypto.pbkdf2Sync(pwd, dbSalt, 10000, 64, 'sha512').toString('base64');
      console.log(hashedPwd);
      console.log(dbPwd);
      if( hashedPwd !== dbPwd ) {
        //입력한 비밀번호가 틀린 경우 
        res.status(401).json({ message: 'login failed' });
      } else {
        // 입력한 비밀번호가 맞은 경우 
        delete result.dataValues.pwd;
        let accessToken = generateAccessToken(result.dataValues);
        let refreshToken = generateRefreshToken(result.dataValues);
        const cookie= {
          httpOnly: true,
          domain:'recollect.today',
              maxAge: 24 * 6 * 60 * 10000,
              secure: true,
          sameSite: 'none'
        };
        //accessToken과 requestToken을 생성 후에 쿠키와 헤더에 담아 보낸다 
        res.cookie('refreshToken', refreshToken, cookie);
        res.setHeader('Authorization',`Bearer ${accessToken}`);
        return res.status(200).json({ message: 'login successfully', accessToken});
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(501).json({ message: 'failed' });
    })
  },
  //* POST /login/pwd/forgot
  forgotPwdController: async(req, res) => {
    let email = await Users.findOne({
      where: { email: req.body.email }
    });
    //해커에게 알리에게 알리지 않으려는 목적
    if( email == null ) {
      return res.json({ message: 'not our user' });
    } else {
  
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
        refreshToken: process.env.GMAIL_REFRESH_TOKEN
      },
    });
  
    const randomPassword = makeRandomPwd(6);
    
    const message = {
      from: process.env.GMAIL_USER,
      to: req.body.email,
      subject:'Recollect에서 알려드립니다',
      html: `
      <h1>
      Recollect에서 임시비밀번호를 알려드립니다.
      </h1>
      <hr />
      <br />
      <h2> 임시비밀번호 : ${randomPassword} </h2>
      <hr />
      <h3 style="color: crimson;">링크를 누르면 임시 비밀번호를 입력하여, 비밀번호를 새롭게 변경하실 수 있습니다.</h3>
      <br />
      <a href=http://localhost:3000/login/pwd/reset?email=${req.body.email}> 새로운 비밀번호 변경</a>
      `
    }
    await Users.update({
      pwd: randomPassword
    }, 
    {
      where: { 
        email: req.body.email
      }
    }).then((result) => {
      transporter.sendMail(message, (err, info) => {
        if(err) {console.log(err) }
        else { console.log(info) }
      });
      return res.status(200).json({ status: 'ok '});
    }).catch((err) => {
      return res.status(501).json({ message: 'failed' });
    })
  }
  },

  //* POST /login/pwd/reset&email=
  resetPwdController: async(req, res) => {
    console.log('바디내용 확인', req.body);
    if(req.body.tempPwd !== undefined ) {
      await Users.findOne({
        where: { pwd: req.body.tempPwd }
      })
      .then((result) => {
        return;
      })
      .catch((err) => {
        return res.status(422).json({ message: 'incorrect information' });
      })
    }
    if(!isValidPwd(req.body.password1)) {
      return res.status(422).json({ message: 'incorrect information' });
    } else {
      let newSalt = crypto.randomBytes(64).toString('hex');
      let newPassword = crypto.pbkdf2Sync(req.body.password1, newSalt, 10000, 64, 'sha512').toString('base64');
      let paramEmail = req.params.id.split('=')[1];
      await Users.update({
        pwd: newPassword,
        salt: newSalt
      }, 
      {
        where: { email: paramEmail }
      })
      .then((result) => {
        return res.status(200).json({ message: 'ok' });
      })
      .catch((err) => {
        return res.status(501).json({ message: 'failed' });
      })
    }
  },

  //* GET /logout
  logOutController: (req, res) => {
    const accessTokenData = verifyToken(req);
    if(!accessTokenData) {
      req.cookie('refreshToken', '');
      return res.status(401).json({ message: 'invalid access token' });
    }
    req.setHeader('authorization', '');
    req.cookie('refreshToken', '');
    return res.status(205).json({ message: 'logout successfully' });
  },
  refreshTokenController: async(req, res) => {
    const refreshTokenData = checkRefreshToken(req.cookies.refreshToken);
    if(!refreshTokenData) {
      return res.status(401).send('invalid refresh token');
    } else {
      await Users.findByPk(refreshTokenData.id)
      .then((result) => {
        const accessToken = generateAccessToken(result.dataValues);
        return resendAccessToken(res, accessToken);
      })
      .catch((err) => {
        return res.status(501).send({
          message: 'Failed To Create'
        });
      })
    }
  }
}
