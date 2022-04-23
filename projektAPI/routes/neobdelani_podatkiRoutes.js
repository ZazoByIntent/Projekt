var express = require('express');
var router = express.Router();
var neobdelani_podatkiController = require('../controllers/neobdelani_podatkiController.js');

/*
 * GET
 */
router.get('/', neobdelani_podatkiController.list);

/*
 * GET
 */
router.get('/:id', neobdelani_podatkiController.show);

/*
 * POST
 */
router.post('/', neobdelani_podatkiController.create);

/*
 * PUT
 */
router.put('/:id', neobdelani_podatkiController.update);

/*
 * DELETE
 */
router.delete('/:id', neobdelani_podatkiController.remove);

module.exports = router;
