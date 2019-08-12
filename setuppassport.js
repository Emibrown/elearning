var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

var User = require('./models/user');
var Tutor = require('./models/tutor');

module.exports = function(){
    passport.serializeUser(function(user, done){
        done(null, user._id);
    });

     passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
         if(err) done(err);
         if(user){
             done(null, user);
         } else {
              Tutor.findById(id, function(err, user){
              if(err) done(err);
              done(null, user);
           });
           }
       });
     });
    
};

passport.use('user-local', new localStrategy({},
    function(username, password, done){
        User.findOne({username : username}, function(err, user){
            if(err){return done(err);}
            if(!user){
                return done(null, false,
                 {message: "Sorry no user has that email!"});
            }
            if(user.password != password){
                 return done(null, false,
                 {message: "Sorry invalied password"});
            }else{
                return done(null, user);
            }
           
        });
    }
));

passport.use('tutor-local', new localStrategy({
    usernameField: 'email'
},
    function(username, password, done) {
         Tutor.findOne({email : username}, function(err, user){
            if(err){return done(err);}
            if(!user){
                return done(null, false,
                 {message: "no admin has that username!"});
            }
            if (user.password != password) {
                return done(null, false, {
                message: 'Incorrect password.'
                });
            }else{
                return done(null, user);
            }
        });
    }
));

