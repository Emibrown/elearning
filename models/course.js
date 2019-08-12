var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var courseSchema = mongoose.Schema(
    {	
    	title:{type: String, required: true},
    	author:{type: mongoose.Schema.Types.ObjectId, ref: 'Tutor'},
    	dis:{type: String, required: true},
    	code:{type: String, required: true, unique: true},	
    	department:{type: String, required: true},
    	cover:{type: String, required: true},
		participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
    }
)
var Course = mongoose.model('Course', courseSchema);

module.exports = Course;