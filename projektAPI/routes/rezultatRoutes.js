var express = require('express');
var router = express.Router();
var rezultatController = require('../controllers/rezultatController.js');

/*
 * GET
 */
router.get('/', rezultatController.list);

/*
 * GET
 */
router.get('/:id', rezultatController.show);

/*
 * POST
 */
router.post('/', rezultatController.create);

/*
 * PUT
 */
router.put('/:id', rezultatController.update);

/*
 * DELETE
 */
router.delete('/:id', rezultatController.remove);

module.exports = router;
