var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var rezultatSchema = new Schema({
	'stanje_ceste' : Number,
	'koordinate' : String
});

module.exports = mongoose.model('rezultat', rezultatSchema);
