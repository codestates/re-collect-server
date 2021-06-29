const { Users, Bookmarks } = require('../models');
const { verifyToken } = require('../utils/token');

module.exports = {
  getController: async(req, res) => {
  const accessTokenData = verifyToken(req);
  console.log('토큰 데이터 확인', accessTokenData);
  if(!accessTokenData) {
    return res.status(401).json({ message: 'invalid access token'});
  } else {
    const user = await Users.findAll({
        attributes: [ 'id', 'username', 'email', 'gitRepo', 'company', 'createdAt', 'updatedAt' ],
        where: { email: accessTokenData.email }
    });

    const bookmark = await Bookmarks.findAll({
        where: { userId: accessTokenData.id }
    });
    try{
      return res.status(200).json({ user, bookmark, message: 'welcome to collect' });
    } catch {
      return res.status(500).json({ message: 'failed' });
    }
    }
  },
  postController: async(req, res) => {
    const accessTokenData = verifyToken(req);
    console.log(req.body);
    const { category, text, url, importance, color } = req.body;
    if(!accessTokenData) {
      return res.status(401).json('invalid access token');
    } else {
      await Bookmarks.create({
        userId: accessTokenData.id, 
        category: category,
        text: text,
        url: url,
        importance: importance,
        color: color
      })
      .then((result) => {
        res.status(201).json({ message: 'created successfully' });
      })
      .catch((err) => {
        console.error(err);
        res.status(501).json({ message: 'failed' });
      })
    }
  },
  putController: async(req, res) => {
    const accessTokenData = verifyToken(req);
    const { category, text, url, importance, color, bookmarkId } = req.body;
    if(!accessTokenData) {
      return res.status(401).json('invalid access token');
    } else {
      await Bookmarks.update({
        category: category,
        text: text,
        url: url,
        importance: importance,
        color: color
      }, {
        where: { id: bookmarkId }
      })
      .then((result) => {
        return res.status(200).json({ message: 'edited successfully' });
      })
      .catch((err) => {
        return res.status(501).json({ message: 'failed' });
      })
    }
  },
  patchController: async(req, res) => {
    const id = req.body.bookmarkId;
    const accessTokenData = verifyToken(req);
    if(!accessTokenData) {
      return res.status(401).json({ message: 'invalid access token' });
    }
    const findBookmark = await Bookmarks.findByPk(req.body.bookmarkId);
    const updateCounts = await Bookmarks.update({
      visitCounts: findBookmark.visitCounts + 1
    },{
      where: { id: id }
    });
    try{
      return res.status(200).json({ message: 'count up successfully' });
    } catch {
      return res.status(501).json({ message: 'failed' });
    }
  },
  deleteController: async(req, res) => {
    const accessTokenData = verifyToken(req);
    if(!accessTokenData) {
      return res.status(401).json({ message: 'invalid access token' });
    }
    await Bookmarks.destroy({
      where: { id: req.body.bookmarkId }
    })
    .then((result) => {
      return res.status(200).json({ message: 'deleted successfully' });
    })
    .catch((err) => {
      return res.status(501).json({ message: 'failed' });
    })
  }
}