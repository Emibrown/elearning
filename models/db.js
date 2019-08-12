var mongoose = require("mongoose");
var dbURL =  "mongodb://127.0.0.1:27017/e-learningDB";
// var dbURL =  "mongodb://uvuuhm5eqelqrok:1vj7JlwNy0UntRBYNAze@b2zyetqtfgkstov-mongodb.services.clever-cloud.com:27017/b2zyetqtfgkstov";
mongoose.connect(dbURL);

mongoose.connection.on('connected', function(){
    console.log('mongoose connected to '+ dbURL);
});
mongoose.connection.on('error', function(err){
    console.log('mongoose connection error'+ err);
});
mongoose.connection.on('disconnected', function(){
    console.log('mongoose disconnected ' );
});