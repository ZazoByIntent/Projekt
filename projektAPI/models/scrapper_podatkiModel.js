var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var scrapper_podatkiSchema = new Schema({
	'lokacija' : String,
	'latitude' : Number,
	'longitude' : Number,
	'cas' : Date,
	'povprecnaHitrost' : String,
	'steviloVozil' : Number,
	'gostota' : String
});

module.exports = mongoose.model('scrapper_podatki', scrapper_podatkiSchema);
