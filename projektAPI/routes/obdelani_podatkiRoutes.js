var express = require('express');
var router = express.Router();
var obdelani_podatkiController = require('../controllers/obdelani_podatkiController.js');

/*
 * GET
 */
router.get('/', obdelani_podatkiController.list);

/*
 * GET
 */
router.get('/:id', obdelani_podatkiController.show);

/*
 * POST
 */
router.post('/', obdelani_podatkiController.create);

/*
 * PUT
 */
router.put('/:id', obdelani_podatkiController.update);

/*
 * DELETE
 */
router.delete('/:id', obdelani_podatkiController.remove);

module.exports = router;
