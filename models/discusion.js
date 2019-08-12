var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var discusionSchema = mongoose.Schema(
    {	
    	message:{type: String, required: true},
    	course:{type: mongoose.Schema.Types.ObjectId, ref: 'Course'},
    	student:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    	tutor:{type: mongoose.Schema.Types.ObjectId, ref: 'Tutor'},
     	createdAt: {type: Date, default: Date.now}
    }
)
var Discusion = mongoose.model('Discusion', discusionSchema);

module.exports = Discusion;
