var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var userSchema = mongoose.Schema(
    {
        fullname: {type: String, required: true},
        username: {type: String, required: true,  unique: true},
        email: {type: String, required: true, unique: true},
        department: {type: String},
        bio: {type: String},
        avatar:{type: String, default: 'avatar.png'},
        password: {type: String, required: true}
    }
)
var User = mongoose.model('User', userSchema);

module.exports = User;