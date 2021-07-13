const express = require('express');
const router = express.Router();
const bookmarkctrl = require('../controller/bookmarkCtrl');

//* POST /bookmark
router.post('/', bookmarkctrl.create);
//* PUT /bookmarks/:id
router.put('/:id', bookmarkctrl.edit);
//* DELETE /bookmarks/:id
router.delete('/:id', bookmarkctrl.destroy);
//* PATCH /bookmarks/:id
router.patch('/:id', bookmarkctrl.updateVisitCounts);
//* PATCH /bookmarks/:id/position
router.patch('/:id/position', bookmarkctrl.updateOnePosition);
//* PATCH /bookmarks/:dragId/:dropId/position
router.patch('/:dragId/:dropId/position', bookmarkctrl.updateAllPosition);


module.exports = router;