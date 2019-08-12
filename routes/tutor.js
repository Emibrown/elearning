var express = require('express');

var User = require('../models/user');
var Course = require('../models/course');
var Coursematerial = require('../models/coursematerial');
var Courseassignment = require('../models/courseassignment');
var Tutor = require('../models/tutor');
var passport = require('passport');
var moment = require('moment');
var Multer = require('multer');
var mime = require('mime');
var fs = require('fs');
var routeradmin = express.Router();


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
   next();
  } else {
    res.redirect("/instructor/login");
  }
};

function Authenticated(req, res, next) {
  if (req.isAuthenticated()) {
       res.redirect('/instructor/dashboard');
  }else {
     next();
  }
};

routeradmin.use(function(req, res, next){
  res.locals.currentInstructor = req.user;
  res.locals.moment = moment;
  next();
});

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

var Storage = Multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
        cb(null, req.body.code + "." + mime.extension(file.mimetype))
    }
});
var MaterialStorage = Multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
var AvaterStorage = Multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, 'public/upload/avatar')
    },
    filename: function (req, file, cb) {
        cb(null, req.user._id + "." + mime.extension(file.mimetype))
    }
});
var upload = Multer({ //multer settings
    storage: Storage,
    fileFilter: function(req, file, cb){
     if(file.mimetype !== mime.lookup('jpg') && file.mimetype !== mime.lookup('png')){
        req.fileValidationError = "Only jpg, png files are allowed";
        return cb(new Error('Only jpg, png files are allowed'))
      }
        cb(null, true)
    }
}).single('file');
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
/* GET home page. */

routeradmin.get('/login', Authenticated, function(req, res, next) {
  res.render('instructor/instructor_login');
});

routeradmin.get('/signup', Authenticated, function(req, res, next) {
  res.render('instructor/instructor_register', {
        title: 'signup'
    });
});

routeradmin.get('/dashboard', ensureAuthenticated, function(req, res, next) {
   Course.find({author: req.user._id}).
    exec(function(err, courses) {
    if (err) { return next(err); }
    if (!courses) { return next(404); }
    res.render('instructor/dashboard', { courses: courses, title: 'dashboard' });
  });
});

routeradmin.get('/courseview/:id/material', ensureAuthenticated, function(req, res, next) {
     Course.findOne({_id: req.params.id}).
          exec(function(err, course) {
          if (err) { return next(err); }
          if (!course) { return next(404); }
              Coursematerial.find({ course: req.params.id}).
                populate('course').
                exec(function(err, materials) {
                if (err) { return next(err); }
                if (!materials) { return next(404); }
                res.render('instructor/material', { 
                      materials: materials, 
                      course: course,
                      title: 'material'
                    });
              });
        });
});

routeradmin.get('/courseview/:id/assignment', ensureAuthenticated, function(req, res, next) {
     Course.findOne({_id: req.params.id}).
          exec(function(err, course) {
          if (err) { return next(err); }
          if (!course) { return next(404); }
              Courseassignment.find({ course: req.params.id}).
                populate('course').
                exec(function(err, assignments) {
                if (err) { return next(err); }
                if (!assignments) { return next(404); }
                res.render('instructor/assignment', { 
                      assignments: assignments, 
                      course: course,
                      title: 'assignment'
                    });
              });
        });
});

routeradmin.get('/courseview/:id/student', ensureAuthenticated, function(req, res, next) {
     Course.findOne({_id: req.params.id}).
          populate('participants').
          exec(function(err, course) {
          if (err) { return next(err); }
          if (!course) { return next(404); }
            res.render('instructor/student', { 
              course: course,
              title: 'student'
            });
        });
});

routeradmin.get('/courseview/:id/discusion', ensureAuthenticated, function(req, res, next) {
     Course.findOne({_id: req.params.id}).
          exec(function(err, course) {
          if (err) { return next(err); }
          if (!course) { return next(404); }
              Coursematerial.find({ course: req.params.id}).
                populate('course').
                exec(function(err, materials) {
                if (err) { return next(err); }
                if (!materials) { return next(404); }
                res.render('instructor/discusion', { 
                      materials: materials, 
                      course: course,
                      title: 'material'
                    });
              });
        });
});

routeradmin.get('/courseview/:id/addmaterial', ensureAuthenticated, function(req, res, next) {
     Course.findOne({_id: req.params.id}).
          exec(function(err, course) {
          if (err) { return next(err); }
          if (!course) { return next(404); }
              res.render('instructor/addmaterial', { 
                course: course,
                title: 'material'
              });
        });
});

routeradmin.get('/courseview/:id/addassignment', ensureAuthenticated, function(req, res, next) {
     Course.findOne({_id: req.params.id}).
          exec(function(err, course) {
          if (err) { return next(err); }
          if (!course) { return next(404); }
              res.render('instructor/addassignment', { 
                course: course,
                title: 'assignment'
              });
        });
});

routeradmin.get('/addcourse',  ensureAuthenticated, function(req, res, next) {
  res.render('instructor/addcourse', {
        title: 'addcourse'
    });
});

routeradmin.get('/profile',  ensureAuthenticated, function(req, res, next) {
  Tutor.findOne({ email: req.user.email }, function(err, tutor) {
    if (err) { return next(err); }
    if (!tutor) { return next(404); }
    res.render('instructor/profile', { 
      tutor: tutor, 
      title: 'profile' 
    });
  });
});

routeradmin.post('/profile',  ensureAuthenticated, function(req, res, next) {
    
    Avaterupload(req,res,function(err){
      if(req.fileValidationError){
           console.log(req.fileValidationError);
           sendJSONresponse(res, 400, {"message": req.fileValidationError});
           return;
      }
     if(req.file){
         req.user.avatar = req.file.filename;
      }
      req.user.firstname = req.body.firstname;
      req.user.lastname = req.body.lastname;
      req.user.title = req.body.title;
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

routeradmin.get('/editcourse/:id',  ensureAuthenticated, function(req, res, next) {
   Course.findOne({ _id: req.params.id }, function(err, course) {
    if (err) { return next(err); }
    if (!course) { return next(404); }
    res.render('instructor/editcourse', { 
      course: course, 
      title: 'course' 
    });
  });
});

routeradmin.post('/editcourse/:id',  ensureAuthenticated, function(req, res, next) {
    
    upload(req,res,function(err){
      if(req.fileValidationError){
           console.log(req.fileValidationError);
           sendJSONresponse(res, 400, {"message": req.fileValidationError});
           return;
      }
     if(req.file){
         var updateCourse = {
            title : req.body.title,
            department : req.body.department,
            dis: req.body.dis,
            cover : req.file.filename
          }
      }else{
          var updateCourse = {
            title : req.body.title,
            department : req.body.department,
            dis: req.body.dis,
          }
      }
      Course.update({_id: req.params.id}, updateCourse, function(err) {
        if (err) {   return next(err); }
           sendJSONresponse(res, 200, {"message": "Course updated sucessfully"});
            return;
      });
    });
});

routeradmin.post('/addcourse',  ensureAuthenticated, function(req, res, next) {
    
    upload(req,res,function(err){
      if(!req.body.title || !req.body.department || !req.body.dis || !req.body.code ){
           sendJSONresponse(res, 400, {"message": "Please fill the form"});
           return;
      }
      Course.findOne({code : req.body.code}, function(err, code){
          if(err){
            return next(err)
          }
          if(code){
            sendJSONresponse(res, 400, {"message": "The course code has already been registered"});
              return;
          }
      });
      if(req.fileValidationError){
           console.log(req.fileValidationError);
           sendJSONresponse(res, 400, {"message": req.fileValidationError});
           return;
      }
       if(!req.file){
          var newCourse = new Course({
            title : req.body.title,
            code : req.body.code,
            author: req.user._id,
            department : req.body.department,
            dis: req.body.dis,
            cover : "cover.jpg"
          });
        }else{
          var newCourse = new Course({
            title : req.body.title,
            code : req.body.code,
            author: req.user._id,
            department : req.body.department,
            dis: req.body.dis,
            cover : req.file.filename
          });
        }
     newCourse.save(function(err, course){
            if (err) { 
                console.log(err);
              return next(err); 
            }else{
               console.log(req.body);
               console.log(req.file);
               sendJSONresponse(res, 200, {"message": "Course created sucessfully"});
          }
      });
    });
});

routeradmin.get('/courseview/:id/removematerial',  ensureAuthenticated, function(req, res, next) {
    Coursematerial.findOneAndRemove({ _id: req.params.id },function(err,material) {
         if (err) { return next(err); }
         fs.unlink("public/upload/"+material.file, function(err){
          if (err && err.code == "ENOENT") {
            console.log("file doesnt exist");
          } else if(err) {
             console.log("error");
          }else{
              console.log("file removed");
          }
         })
         res.redirect("/instructor/courseview/"+material.course+"/material");
    });
});

routeradmin.post('/courseview/:id/addmaterial', ensureAuthenticated, function(req, res, next) {
     Materialupload(req,res,function(err){
      if(!req.body.title ||  !req.body.code || !req.body.dis ){
           sendJSONresponse(res, 400, {"message": "Please fill the form"});
           return;
      }
      Coursematerial.findOne({code : req.body.code}, function(err, code){
          if(err){
            return next(err)
          }
          if(code){
            sendJSONresponse(res, 400, {"message": "The course code has already been register"});
              return;
          }
      });
      if(req.fileValidationError){
           console.log(req.fileValidationError);
           sendJSONresponse(res, 400, {"message": req.fileValidationError});
           return;
      }
       if(!req.file){
          var newCoursematerial = new Coursematerial({
            title : req.body.title,
            code : req.body.code,
            course: req.params.id,
            dis: req.body.dis
          });
        }else{
          var newCoursematerial = new Coursematerial({
            title : req.body.title,
            code : req.body.code,
            course: req.params.id,
            dis: req.body.dis,
            file : req.file.filename
          });
        }
     newCoursematerial.save(function(err, material){
            if (err) { 
                console.log(err);
              return next(err); 
            }else{
               console.log(req.body);
               console.log(req.file);
               sendJSONresponse(res, 200, {"message": "Material added sucessfully"});
          }
      });
    });
});

routeradmin.get('/courseview/:id/removeassignment',  ensureAuthenticated, function(req, res, next) {
    Courseassignment.findOneAndRemove({ _id: req.params.id },function(err,assignment) {
         if (err) { return next(err); }
         fs.unlink("public/upload/"+assignment.file, function(err){
          if (err && err.code == "ENOENT") {
            console.log("file doesnt exist");
          } else if(err) {
             console.log("error");
          }else{
              console.log("file removed");
          }
         })
         res.redirect("/instructor/courseview/"+assignment.course+"/assignment");
    });
});

routeradmin.get('/courseview/:id/editassignment',  ensureAuthenticated, function(req, res, next) {
    Courseassignment.findOne({ _id: req.params.id },function(err,assignment) {
         if (err) { return next(err); }
          if (!assignment) { return next(404); }
          Course.findOne({ _id: assignment.course }, function(err, course) {
            if (err) { return next(err); }
            if (!course) { return next(404); }
            res.render('instructor/editassignment', { 
              assignment: assignment, 
              course: course,
              title: 'assignment' 
            });
          });
    });
});

routeradmin.get('/courseview/:id/submission', ensureAuthenticated, function(req, res, next) {
   Courseassignment.findOne({_id: req.params.id})
    .populate('submission.user')
    .exec(function(err, assignment) {
       Courseassignment.count().exec(function(err, count) {
                if (err) return next(err)
                Course.findOne({ _id: assignment.course }, function(err, course) {
                  if (err) { return next(err); }
                  if (!course) { return next(404); }
                  res.render('instructor/submission', {
                      assignment: assignment,
                      course: course,
                      count: count,
                      title: 'assignment'
                  })
                });
            })
    });
});


routeradmin.post('/courseview/:id/addassignment', ensureAuthenticated, function(req, res, next) {
     Materialupload(req,res,function(err){
      console.log(req.body);
      if(!req.body.title ||  !req.body.date || !req.body.content ){
           sendJSONresponse(res, 400, {"message": "Please fill the form"});
           return;
      }
      if(req.fileValidationError){
           console.log(req.fileValidationError);
           sendJSONresponse(res, 400, {"message": req.fileValidationError});
           return;
      }
       if(!req.file){
          var newCourseasignment = new Courseassignment({
            title : req.body.title,
            submissionDate : req.body.date,
            course: req.params.id,
            content: req.body.content
          });
        }else{
          var newCourseasignment = new Courseassignment({
            title : req.body.title,
            submissionDate : req.body.date,
            course: req.params.id,
            content: req.body.content,
            file : req.file.filename
          });
        }
     newCourseasignment.save(function(err, assignment){
            if (err) { 
              console.log(err);
              return next(err); 
            }else{
               console.log(assignment);
               console.log(req.file);
               sendJSONresponse(res, 200, {"message": "Assignment added sucessfully"});
          }
      });
    });
});

routeradmin.post('/courseview/:id/editassignment', ensureAuthenticated, function(req, res, next) {
     Materialupload(req,res,function(err){
      console.log(req.body);
      if(!req.body.title ||  !req.body.date || !req.body.content ){
           sendJSONresponse(res, 400, {"message": "Please fill the form"});
           return;
      }
      if(req.fileValidationError){
           console.log(req.fileValidationError);
           sendJSONresponse(res, 400, {"message": req.fileValidationError});
           return;
      }
       if(!req.file){
          var updateCourseasignment = {
            title : req.body.title,
            submissionDate : req.body.date,
            content: req.body.content
          };
        }else{
          var updateCourseasignment = {
            title : req.body.title,
            submissionDate : req.body.date,
            content: req.body.content,
            file : req.file.filename
          };
        }
      Courseassignment.update({_id: req.params.id}, updateCourseasignment, function(err) {
        if (err) {   return next(err); }
           sendJSONresponse(res, 200, {"message": "Assignment updated sucessfully"});
            return;
      });
    });
});

routeradmin.get('/removecourse/:id',  ensureAuthenticated, function(req, res, next) {
    Course.findOneAndRemove({ _id: req.params.id },function(err,course) {
         if (err) { return next(err); }
         fs.unlink("public/upload/"+course.cover, function(err){
          if (err && err.code == "ENOENT") {
            return console.log("file doesnt exist");
          } else if(err) {
             return console.log("error");
          }else{
              console.log("file removed");
          }
         })
         res.redirect("/instructor/dashboard");
    });
});

routeradmin.post('/changepassword', ensureAuthenticated,  function(req, res, next) {
   if(!req.body.cpassword || !req.body.password1 || !req.body.password2){
          sendJSONresponse(res, 400, {"message": "All the fields are required"});
          return;
        }
     Admin.findOne({ username: req.user.username }, function(err, user) {
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
           Admin.update({username: req.user.username}, { password: req.body.password1 }, function(err) {
              if (err) {   return next(err); }
                 sendJSONresponse(res, 200, {"message": "Password changed successfully."});
                  return;
            });
        }
      });
});


routeradmin.post('/register', function(req, res, next) {
  if(!req.body.firstname || !req.body.lastname ||  !req.body.email ||  !req.body.password1 || !req.body.password2 ){
    sendJSONresponse(res, 400, {"message": "All the fields are very important"});
      return;
  }
  if(req.body.password1 != req.body.password2){
     sendJSONresponse(res, 400, {"message": "Password miss-match"});
     return;
  }else{
      var firstname = req.body.firstname;
      var lastname = req.body.lastname;
      var email = req.body.email;
      var password = req.body.password1;
            Tutor.findOne({email : email}, function(err, semail){
              if(err){
                return next(err)
              }
              if(semail){
                sendJSONresponse(res, 400, {"message": "Email address has already been register"});
                  return;
              }else{
                  var newTutor = new Tutor({
                    firstname : firstname,
                    lastname : lastname,
                    email : email,
                    password : password
                  });
                  newTutor.save(function(err, tutor){
                        if (err) { 

                            console.log(err);
                          return next(err); 
                        }else{
                        console.log('user saved');
                        console.log(tutor);
                        sendJSONresponse(res, 200, {"message": "Account created successfully"});
                      }
                  });
              }
        })
     }
});

routeradmin.get('/logout', function(req, res) {
 req.logout();
 res.redirect('/instructor/login');
});

routeradmin.post('/login', function(req, res, next) {
      passport.authenticate('tutor-local', {failureFlash:true}, function(err, user, info) {
       if(!req.body.password || !req.body.email){
          sendJSONresponse(res, 400, {"message": "Enter your Email Address and Password"});
          console.log("error")
          return;
        }
       if (err) { return next(err); }
       if (!user) { 
          sendJSONresponse(res, 400, {"message": "Invalied Login Credentials"});
          console.log("invalied")
          return;
        }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
         sendJSONresponse(res, 200, {"message": "Login successfully please wait,,,,"});
          return;
     });
    })(req, res, next);
    });

module.exports = routeradmin;
