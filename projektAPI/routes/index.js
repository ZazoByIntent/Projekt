var express = require('express');
var router = express.Router();
var rezultatModel = require('../models/rezultatModel.js');
var multer = require('multer');
const photoController = require('../controllers/photoController.js');

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, './uploads')
  },
  filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+'.jpg')
  }
})

var upload = multer ({ storage: storage});

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

router.post('/upload_image', upload.single('myFile'), photoController.create);

module.exports = router;
