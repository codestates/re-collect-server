const express = require('express');
const router = express.Router();
const explorectrl = require('../controller/exploreCtrl');

//* GET /explore
router.get('/', explorectrl.sendRandomUser);


module.exports = router;