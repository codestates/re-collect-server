const express = require('express');
const router = express.Router();
const profilectrl = require('../controller/profileCtrl');

//* GET /profile
router.get('/', profilectrl.getProfile);

//* PATCH /profile/username
router.patch('/username', profilectrl.changeUsername);

//* PATCH /profile/pwd
router.patch('/pwd', profilectrl.changePwd);

//* PATCH /profile/company
router.patch('/company', profilectrl.changeCompany);

//* PATCH /profile/gitrepo
router.patch('/gitrepo', profilectrl.changeGitrepo);

//* DELETE /profile
router.delete('/', profilectrl.deleteAccount);







module.exports = router;