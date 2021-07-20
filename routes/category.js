const express = require('express');
const router = express.Router();
const categoryctrl = require('../controller/categoryCtrl');

//* PUT /category
router.put('/', categoryctrl.edit);
//* DELETE /category/:id
router.delete('/:id', categoryctrl.destroy);

module.exports = router;