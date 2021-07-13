const express = require('express');
const router = express.Router();
const collectctrl = require('../controller/collectCtrl');

//* GET /collect
router.get('/', collectctrl.getCollect);


module.exports = router;