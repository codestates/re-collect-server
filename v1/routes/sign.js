const express = require('express');
const router = express.Router();
const { signUpController, logInController, forgotPwdController, resetPwdController, logOutController, refreshTokenController } = require('../controllers/signController');

router.get('/refreshtoken', refreshTokenController);
router.post('/signup', signUpController);
router.post('/login', logInController);
router.post('/login/pwd/:id', (req, res)=> {
  if(req.params.id === 'forgot'){
    return forgotPwdController(req, res);
  }
  if( req.params.id.split('&')[0] === 'reset') {
    return resetPwdController(req, res);
  }
});
router.get('/logout', logOutController);


module.exports = router;
