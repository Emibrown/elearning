var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var courseassignmentSchema = mongoose.Schema(
    {	
    	title:{type: String, required: true},
    	course:{type: mongoose.Schema.Types.ObjectId, ref: 'Course'},
    	content:{type: String, required: true},	
    	submissionDate: {type: Date, required: true},
    	file:{type: String},
    	submission:[
            {
                user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
                content:{type: String, required: true},
                file:{type: String},
                submitedOn: {type: Date, default: Date.now},
            }
        ]
    }
)
var Courseassignment = mongoose.model('Courseassignment', courseassignmentSchema);

module.exports = Courseassignment;
