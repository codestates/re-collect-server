let express = require('express');
let router = express.Router();
let { getController, postController, putController, patchController, deleteController } = require('../controllers/collectController');

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
