var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');

/*
 * GET
 */
router.get('/', userController.list);

/*
 * GET
 */
router.get('/:id', userController.show);
router.get('/logout', userController.logout);
/*
 * POST
 */
router.post('/login', userController.login);
router.post('/', userController.create);

/*
 * PUT
 */
router.put('/:id', userController.update);

/*
 * DELETE
 */
router.delete('/:id', userController.remove);

module.exports = router;
