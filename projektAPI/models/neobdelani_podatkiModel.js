var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var neobdelani_podatkiSchema = new Schema({
	'x_rotacija' : Number,
	'y_rotacija' : Number,
	'z_rotacija' : Number,
	'x_pospesek' : Number,
	'y_pospesek' : Number,
	'z_pospesek' : Number,
	'latitude' : String,
	'longitude' : String,
	'user_id' : String,
	'datum' : Date
});

module.exports = mongoose.model('neobdelani_podatki', neobdelani_podatkiSchema);
