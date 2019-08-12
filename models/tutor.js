var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var tutorSchema = mongoose.Schema(
    {
    	firstname: {type: String, required: true},
    	lastname: {type: String, required: true},
    	title: {type: String, default: 'Mr'},
        email: {type: String, required: true, unique: true},
        bio: {type: String},
        avatar:{type: String, default: 'avatar.png'},
        password: {type: String, required: true},
    }
)
var Tutor = mongoose.model('Tutor', tutorSchema);

module.exports = Tutor;