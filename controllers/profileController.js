const { Users, Bookmarks } = require('../models');
const { verifyToken } = require('../utils/token');
const { isValidPwd } = require('../utils/password');
const crypto = require('crypto');

module.exports = {
  getProfileController: async(req, res) => {
    const accessTokenData = verifyToken(req);
    console.log('엑세스토큰을 확인', accessTokenData);
    if(!accessTokenData) {
      return res.status(401).json({ message: 'invalid access token'});
    } else {
      const user = await Users.findOne({
        where: { email: accessTokenData.email },
        attributes: ['id', 'username', 'email', 'gitRepo', 'company', 'createdAt', 'updatedAt']
      });
      const bookmark = await Bookmarks.findAll({
        where: { userId: accessTokenData.id }
      });
      try {
        return res.status(200).json({ user, bookmark, message: 'get profile successfully'});
      } 
      catch {
        return res.status(501).json({ message: 'failed' });
      }
    }
  },
  updatePwdController: async(req, res) => {
    const accessTokenData = verifyToken(req);
    const pwd = req.body.pwd;
    if(!accessTokenData) {
      return res.status(401).json({ message: 'invalid access token' });
    } else {
      if(!isValidPwd(pwd)) {
        return res.status(422).json({ message: 'incorrect information' });
      }
      let newSalt = crypto.randomBytes(64).toString('hex');
      let newPassword = crypto.pbkdf2Sync(pwd, newSalt, 10000, 64, 'sha512').toString('base64');
      await Users.update({
        salt: newSalt,
        pwd: newPassword
      }, {
        where: { email: accessTokenData.email }
      })
      .then((result) => {
        return res.status(200).json({ message: 'edited profile successfully' });
      })
      .catch((err) => {
        return res.status(501).json({ message: 'failed' });
      })
    }
  },
  updateUsernameController: async(req, res) => {
    const accessTokenData = verifyToken(req);
    if(!accessTokenData) {
      return res.status(401).json({ message: 'invalid access token' });
    } else {
      await Users.update({
        username: req.body.username
      }, {
        where: { email: accessTokenData.email }
      })
      .then((result) => {
        return res.status(200).json({ message: 'edited profile successfully' });
      })
      .catch((err) => {
        return res.status(501).json({ message: 'failed' });
      })
    }
  },
  updateGitController: async(req, res) => {
    const accessTokenData = verifyToken(req);
    if(!accessTokenData) {
      return res.status(401).json({ message: 'invalid access token' });
    } else {
      await Users.update({
        gitRepo: req.body.gitrepo
      }, {
        where: { email: accessTokenData.email }
      })
      .then((result) => {
        return res.status(200).json({ message: 'edited profile successfully' })
      })
      .catch((err) => {
        return res.status(501).json({ message: 'failed' });
      })
    }
  },
  updateCompanyController: async(req, res) => {
    const accessTokenData = verifyToken(req);
    if(!accessTokenData) {
      return res.status(401).json({ message: 'invalid access token' });
    } else {
      await Users.update({
        company: req.body.company
      }, {
        where: { email: accessTokenData.email }
      })
      .then((result) => {
        return res.status(200).json({ message: 'edited profile successfully' })
      })
      .catch((err) => {
        return res.status(501).json({ message: 'failed' });
      })
    }
  },
  deleteProfileController: async(req, res) => {
    const accessTokenData = verifyToken(req);
    if(!accessTokenData) {
      return res.status(401).json({ message: 'invalid access token' });
    } else {
      await Users.destroy({
        where: { email: accessTokenData.email }
      })
      .then((result) => {
        return res.status(205).json({ message: 'deleted account successfully' });
      })
      .catch((err) => {
        return res.status(501).json({ message: 'failed' });
      })
    }
  }
}
