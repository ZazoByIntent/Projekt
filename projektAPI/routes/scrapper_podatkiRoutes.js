var express = require('express');
var router = express.Router();
var scrapper_podatkiController = require('../controllers/scrapper_podatkiController.js');

/*
 * GET
 */
router.get('/', scrapper_podatkiController.list);

/*
 * GET
 */
router.get('/:id', scrapper_podatkiController.show);

/*
 * POST
 */
router.post('/', scrapper_podatkiController.create);

/*
 * PUT
 */
router.put('/:id', scrapper_podatkiController.update);

/*
 * DELETE
 */
router.delete('/:id', scrapper_podatkiController.remove);
router.delete('/', scrapper_podatkiController.removeall);


module.exports = router;
