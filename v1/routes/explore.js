const express = require('express');
const router = express.Router();
const { sendRandomUsers } = require('../controllers/exploreController');

//* GET /explore
router.get('/', sendRandomUsers);


module.exports = router;

