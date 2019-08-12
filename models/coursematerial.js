var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var coursematerialSchema = mongoose.Schema(
    {	
    	title:{type: String, required: true},
    	course:{type: mongoose.Schema.Types.ObjectId, ref: 'Course'},
    	dis:{type: String, required: true},
    	code:{type: String, required: true, unique: true},	
    	file:{type: String}
    }
)
var Coursematerial = mongoose.model('Coursematerial', coursematerialSchema);

module.exports = Coursematerial;
