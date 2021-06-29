const express = require('express');
const router = express.Router();
const { getController, postController, putController, patchController, deleteController } = require('../controllers/collectController');

//* GET /collect
router.get('/', getController);

//* POST /collect
router.post('/', postController);

//* PUT /collect
router.put('/', putController);

//* PATCH /collect 
router.patch('/', patchController);

//* DELETE /collect
router.delete('/', deleteController);

module.exports = router;
