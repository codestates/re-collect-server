const express = require('express');
const router = express.Router();
const { getProfileController, updatePwdController, updateUsernameController, updateGitController, updateCompanyController, deleteProfileController } = require('../controllers/profileController');


//* GET /profile
router.get('/',getProfileController);

//* PATCH /profile
router.patch('/:id', (req, res) => {
  if(req.params.id === 'pwd') {
    updatePwdController(req, res);
  }
  if( req.params.id === 'username') {
    updateUsernameController(req, res);
  }
  if( req.params.id === 'gitrepo') {
    updateGitController(req, res);
  }
  if( req.params.id === 'company' ) {
    updateCompanyController(req, res);
  } else {
    //* 예외 경우에 대한 에러 핸들링 
  }
});

//* DELETE /profile
router.delete('/', deleteProfileController);


module.exports = router;