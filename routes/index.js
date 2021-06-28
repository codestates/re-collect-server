let express = require('express');
let router = express.Router();
let { signUpController, logInController, forgotPwdController, resetPwdController, logOutController } = require('../controllers/signController');


/* GET home page. */
router.post('/signup', signUpController);
router.post('/login', logInController);
router.post('/login/pwd/:id', (req, res)=> {
  console.log('확인', req.params);
  if(req.params.id === 'forgot'){
    return forgotPwdController(req, res);
  }
  if( req.params.id.split('&')[0] === 'reset') {
    return resetPwdController(req, res);
  }
});
router.get('/logout', logOutController);


module.exports = router;
