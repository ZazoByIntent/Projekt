var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var obdelani_podatkiSchema = new Schema({
	'pospesek' : Number,
	'rotacija' : Number,
	'latitude' : String,
	'longitude' : String,
	'datum' : Date
});

module.exports = mongoose.model('obdelani_podatki', obdelani_podatkiSchema);
