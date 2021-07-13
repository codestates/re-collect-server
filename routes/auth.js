const express = require('express');
const router = express.Router();
const authctrl = require('../controller/authCtrl');

//* POST /auth/tmp
router.post('/tmp', authctrl.sendMail);

//* POST /auth/pwd
router.post('/pwd', authctrl.resetPwd);

//* POST /auth/username
router.post('/username', authctrl.checkUsername);

//* POST /auth/email
router.post('/email', authctrl.checkEmail);

//* GET /auth/token
router.get('/token', authctrl.renewToken);




module.exports = router;