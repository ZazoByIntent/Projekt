var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var photoSchema = new Schema({
	'path' : String,
	'user_id' : String
});

module.exports = mongoose.model('photo', photoSchema);
