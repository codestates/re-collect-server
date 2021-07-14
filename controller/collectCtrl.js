const BookmarkMiddleware = require('../middleware/bookmark');
const CategoryMiddleware = require('../middleware/category');
const TokenMiddleware = require('../middleware/token');


module.exports = {
  getCollect: async(req, res, next) => {
    const accessTokenData = TokenMiddleware.verifyToken(req);
    if(!accessTokenData) {
      return res.status(401).json({ message: 'invalid access token' });
    } else {
      try {
        console.log(accessTokenData);
        const categories = await CategoryMiddleware.getAll(accessTokenData.id);
        const bookmarks = await BookmarkMiddleware.getAll(accessTokenData.id);

        const onlyTitles = categories.map((category) => category.title);
        const mappingCategory = categories.map((category) => {
          category.bookmarks = [];
          for(let idx in bookmarks ) {
            if( bookmarks[idx].categoryId === category.id ) {
              category.bookmarks.push(bookmarks[idx]);
            }
          }
          category.bookmarks.sort((a, b) => a.position - b.position );
          return category;
        });
        res.status(200).json({ bookmarks ,reducedbookmarks: mappingCategory, category: onlyTitles })
      } catch(err) {
        next(new Error('failed'));
      }
    }
  }
}
