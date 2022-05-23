var express = require('express');
var router = express.Router();
var photoController = require('../controllers/photoController.js');

/*
 * GET
 */
router.get('/', photoController.list);

/*
 * GET
 */
router.get('/:id', photoController.show);

/*
 * POST
 */
router.post('/', photoController.create);

/*
 * PUT
 */
router.put('/:id', photoController.update);

/*
 * DELETE
 */
router.delete('/:id', photoController.remove);

module.exports = router;
