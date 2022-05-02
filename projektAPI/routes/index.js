var express = require('express');
var router = express.Router();
var rezultatModel = require('../models/rezultatModel.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  rezultatModel.find(function(err, rezultati) {
    if (err) {
      return res.status(500).json({
          message: 'Error when getting question.',
          error: err
      });
  } else {
    res.render('index', {rezultati});
    }
  })
});

module.exports = router;
