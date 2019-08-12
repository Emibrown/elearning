var express = require('express');

var Student = require('../models/user');
var Course = require('../models/course');
var Coursematerial = require('../models/coursematerial');
var Courseassignment = require('../models/courseassignment');
var passport = require('passport');
var moment = require('moment');
var Multer = require('multer');
var mime = require('mime');
var nodemailer = require("nodemailer");
var shortid = require('shortid');
var fs = require('fs');
var router = express.Router();


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
   next();
  } else {
    res.redirect("/student/login");
  }
};


function Authenticated(req, res, next) {
  if (req.isAuthenticated()) {
       res.redirect('/student/dashboard');
  }else {
     next();
  }
};

var MaterialStorage = Multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
var Materialupload = Multer({ //multer settings
    storage: MaterialStorage,
    fileFilter: function(req, file, cb){
      if(file.mimetype !== mime.lookup('jpg') && file.mimetype !== mime.lookup('png') && file.mimetype !== mime.lookup('pdf') && file.mimetype !== mime.lookup('doc') && file.mimetype !== mime.lookup('docx')){
        req.fileValidationError = "Only jpg, png files are allowed";
        return cb(new Error('Only jpg, png, pdf, docx, doc files are allowed'))
      }
        cb(null, true)
    }
}).single('file');

var AvaterStorage = Multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, 'public/upload/avatar')
    },
    filename: function (req, file, cb) {
        cb(null, req.user._id+"-"+shortid.generate() + "." + mime.extension(file.mimetype))
    }
});
var Avaterupload = Multer({ //multer settings
    storage: AvaterStorage,
    fileFilter: function(req, file, cb){
      if(file.mimetype !== mime.lookup('jpg') && file.mimetype !== mime.lookup('png')){
        req.fileValidationError = "Only jpg, png files are allowed";
        return cb(new Error('Only jpg, png files are allowed'))
      }
        cb(null, true)
    }
}).single('file');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

router.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.moment = moment;
  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  Course.find({}).
    limit(8).
    populate('author').
    exec(function(err, courses) {
    if (err) { return next(err); }
    if (!courses) { return next(404); }
    res.render('student/index', { courses: courses, title: 'home' });
  });
});

/* GET home page. */
router.get('/courses', function(req, res, next) {
   Course.find({}).
    populate('author').
    exec(function(err, courses) {
    if (err) { return next(err); }
    if (!courses) { return next(404); }
    res.render('student/courses', { courses: courses, title: 'courses' });
  });
});

router.get('/course/:id', function(req, res, next) {
   Course.findOne({_id : req.params.id}).
    populate('author').
    exec(function(err, course) {
    if (err) { return next(err); }
    if (!course) { return next(404); }
    res.render('student/courses_detials', { course: course, title: 'courses' });
  });
});

router.get('/signup', function(req, res, next) {
  res.render('student/register', {
        title: 'signup'
    });
});


router.get('/login',  function(req, res) {
  res.render('student/login', {
        title: 'login'
    });
});



router.get('/dashboard', ensureAuthenticated, function(req, res, next) {
   Course.find({participants: req.user._id}).
    exec(function(err, courses) {
    if (err) { return next(err); }
    if (!courses) { return next(404); }
    res.render('student/dashboard', { courses: courses, title: 'dashboard' });
  });
});

router.get('/profile',  ensureAuthenticated, function(req, res, next) {
  Student.findOne({ _id: req.user._id }, function(err, student) {
    if (err) { return next(err); }
    if (!student) { return next(404); }
    res.render('student/profile', { 
      student: student, 
      title: 'profile' 
    });
  });
});

router.get('/courseview/:id/material', ensureAuthenticated, function(req, res, next) {
       Course.findOne({_id: req.params.id}).
          exec(function(err, course) {
          if (err) { return next(err); }
          if (!course) { return next(404); }
              Coursematerial.find({ course: req.params.id}).
                populate('course').
                exec(function(err, materials) {
                if (err) { return next(err); }
                if (!materials) { return next(404); }
                res.render('student/material', { 
                      materials: materials, 
                      course: course,
                      title: 'material'
                    });
              });
        });
});

router.get('/courseview/:id/assignment', ensureAuthenticated, function(req, res, next) {
     Course.findOne({_id: req.params.id}).
          exec(function(err, course) {
          if (err) { return next(err); }
          if (!course) { return next(404); }
              Courseassignment.find({ course: req.params.id}).
                populate('course').
                exec(function(err, assignments) {
                if (err) { return next(err); }
                if (!assignments) { return next(404); }
                res.render('student/assignment', { 
                      assignments: assignments, 
                      course: course,
                      title: 'assignment'
                    });
              });
        });
});

router.get('/courseview/:id/submitassignment',  ensureAuthenticated, function(req, res, next) {
    Courseassignment.findOne({ _id: req.params.id },function(err,assignment) {
         if (err) { return next(err); }
          if (!assignment) { return next(404); }
          Course.findOne({ _id: assignment.course }, function(err, course) {
            if (err) { return next(err); }
            if (!course) { return next(404); }
            res.render('student/submitassignment', { 
              assignment: assignment, 
              course: course,
              title: 'assignment' 
            });
          });
    });
});

router.post('/courseview/:id/submitassignment', ensureAuthenticated,  function(req, res, next) {
    Materialupload(req,res,function(err){
      var found = false;
       if(!req.body.content ){
             sendJSONresponse(res, 400, {"message": "Content is required"});
             return;
        }
        Courseassignment.findOne({_id : req.params.id}).
          exec(function(err, assignment) {
          if (err) { return next(err); }
          if (!assignment) { return next(err); }
          for(var i = 0; i < assignment.submission.length; i++) {
              if (JSON.stringify(assignment.submission.user) == JSON.stringify(req.user._id)) {
                 found = true;
                 break;
              }
          }
          if(!found){
            if(req.file){
               var submission = {
                user:req.user._id, 
                content: req.body.content,
                file: req.file.filename
              }
            }else{
              var submission = {
                user:req.user._id, 
                content: req.body.content
              }
            }
             Courseassignment.update({_id: req.params.id},{ $push:{  submission: submission } }, function(err) {
                if (err) {   return next(err); }
                   sendJSONresponse(res, 200, {"message": "Assignment submited successfully."});
                    return;
              });
          }else{
            if(req.file){
               fs.unlink("public/upload/"+req.file.filename, function(err){
                if (err && err.code == "ENOENT") {
                } else if(err) {
                }else{
                }
               });
                sendJSONresponse(res, 400, {"message": "You already apply for this job."});
            }
          }
        });
    });
});


router.get('/courseview/:id/discusion', ensureAuthenticated, function(req, res, next) {
     Course.findOne({_id: req.params.id}).
          exec(function(err, course) {
          if (err) { return next(err); }
          if (!course) { return next(404); }
              Coursematerial.find({ course: req.params.id}).
                populate('course').
                exec(function(err, materials) {
                if (err) { return next(err); }
                if (!materials) { return next(404); }
                res.render('student/discusion', { 
                      materials: materials, 
                      course: course,
                      title: 'material'
                    });
              });
        });
});

router.post('/profile',  ensureAuthenticated, function(req, res, next) {
    
    Avaterupload(req,res,function(err){
      if(req.fileValidationError){
           console.log(req.fileValidationError);
           sendJSONresponse(res, 400, req.fileValidationError);
           return;
      }
     if(req.file){
         req.user.avatar = req.file.filename;
      }
      req.user.fullname = req.body.fullname;
      req.user.department = req.body.department;
      req.user.bio =  req.body.bio;
      req.user.save(function(err) {
        if (err) {
        next(err);
        return;
      }
       sendJSONresponse(res, 200, {"message": "Profile updated!"});
        return;
      });
    });
});

router.get('/joincourse/:id',  ensureAuthenticated, function(req, res, next) {
  Course.findOne({_id: req.params.id}, function(err, course){
    if(course.participants.indexOf(req.user._id) > -1){
      res.redirect("/student/course/"+req.params.id);
      return;
    }else{
        Course.update({ _id: req.params.id },{ $push:{ participants:req.user._id}},function(err) {
             if (err) { return next(err); }
             res.redirect("/student/dashboard");
        });
    }
  })
});

router.get('/unjoincourse/:id',  ensureAuthenticated, function(req, res, next) {
    Course.update({ _id: req.params.id },{ $pull:{ participants:req.user._id}},function(err) {
         if (err) { return next(err); }
         res.redirect("/student/dashboard");
    });
});

router.get('/recovery',  Authenticated, function(req, res, next) {
  res.render('student/recovery');
});


router.post('/recovery',  Authenticated, function(req, res, next) {
  var smtpTransport  = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'swiftpaycommunity@gmail.com',
          pass: 'swiftpay123'
      }
  });
  if(!req.body.email){
      sendJSONresponse(res, 400, {"message": "Email address required"});
      return;
  }
   User.findOne({ email: req.body.email }, function(err, user){
      if (err) { return next(err); }
      if (!user) { 
          sendJSONresponse(res, 400, {"message": "Invalied email address"});
          return;
      }
      var mailOptions = {
          from: "SWIFTPAY COMMUNITY", // sender address
          to: "emekaekene@gmail.com", // list of receivers
          subject: "PASSWORD RECOVERY", // Subject line
          html: "<h2><b>Hello " + user.username + "</b></h2><h3> Your login password is " + user.password + "</h3>" // html body
      }
      smtpTransport.sendMail(mailOptions, function(error, response){
          if(error){
              console.log(error);
              sendJSONresponse(res, 400, {"message": "Message not send"});
          }else{
               sendJSONresponse(res, 200, {"message": "You login details have been send to your email"});
          }
          // if you don't want to use this transport object anymore, uncomment following line
          smtpTransport.close(); // shut down the connection pool, no more messages
      });
   });
});


router.post('/changepassword', ensureAuthenticated,  function(req, res, next) {
   if(!req.body.cpassword || !req.body.password1 || !req.body.password2){
          sendJSONresponse(res, 400, {"message": "All the fields are required"});
          return;
        }
     User.findOne({ username: req.user.username }, function(err, user) {
        if (err) { return next(err); }
        if (!user) { return next(404); }
        if(user.password != req.body.cpassword){
           sendJSONresponse(res, 400, {"message": "Invalied current password"});
          return;
        }
        if(req.body.password1 != req.body.password2){
           sendJSONresponse(res, 400, {"message": "Your password and confirmation password do not match."});
          return;
        }else{
           User.update({username: req.user.username}, { password: req.body.password1 }, function(err) {
              if (err) {   return next(err); }
                 sendJSONresponse(res, 200, {"message": "password changed successfully."});
                  return;
            });
        }
      });
});

router.post("/edit/profile/details", ensureAuthenticated, function(req, res, next) {
  req.user.fullname = req.body.fullname;
  req.user.country = req.body.country;
  req.user.contact = req.body.contact;
  req.user.contact2 = req.body.contact2;
  req.user.save(function(err) {
    if (err) {
    next(err);
    return;
  }
   sendJSONresponse(res, 200, {"message": "User details updated!"});
    return;
  });
});

router.get('/logout', function(req, res) {
 req.logout();
 res.redirect('/user/login');
});


router.post('/register', function(req, res, next) {
  if(!req.body.fullname || !req.body.username || !req.body.email ||  !req.body.password1 || !req.body.password2 ){
    sendJSONresponse(res, 400, {"message": "All the fields are very important"});
      return;
  }
  if(req.body.password1 != req.body.password2){
     sendJSONresponse(res, 400, {"message": "Password miss-match"});
     return;
  }else{
      var fullname = req.body.fullname;
      var email = req.body.email;
      var username = req.body.username;
      var password = req.body.password1;
      Student.findOne({username : username}, function(err, susername){
          if(err){
            console.log('err err');
            return next(err);
          }
          if(susername){
             sendJSONresponse(res, 400, { "message":"Username has already been register"});
              return;
          }
          else{
            Student.findOne({email : email}, function(err, semail){
              if(err){
                console.log(err)
                return next(err)
              }
              if(semail){
                sendJSONresponse(res, 400, {"message": "Email address has already been register"});
                  return;
              }else{
                  var newStudent = new Student({
                    fullname : fullname,
                    email : email,
                    username : username,
                    password : password
                  });
                  newStudent.save(function(err, user){
                        if (err) { 
                           console.log(err)
                          return next(err); 
                        }else{
                        console.log('user saved');
                        console.log(user);
                        sendJSONresponse(res, 200, {"message": "Account created successfully"});
                      }
                  });
              }
            });
          }
        })
     }
});

router.post('/login', function(req, res, next) {
      passport.authenticate('user-local', {failureFlash:true}, function(err, user, info) {
       if(!req.body.password || !req.body.username){
         sendJSONresponse(res, 400, {"message": "Enter your username and password"});
          console.log("error")
          return;
        }
       if (err) { return next(err); }
       if (!user) { 
          sendJSONresponse(res, 400, {"message": "Invalied login credentials"});
          console.log("invalied")
          return;
        }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        sendJSONresponse(res, 200, {"message": "Login successfull please wait,,,,"});
          return;
     });
    })(req, res, next);
    });

module.exports = router;
