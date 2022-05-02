var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var rezultatSchema = new Schema({
	'stanje_ceste' : Number,
	'koordinate' : String,
	'datum' : Date
});

module.exports = mongoose.model('rezultat', rezultatSchema);
