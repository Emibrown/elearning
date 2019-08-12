var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var favicon = require("serve-favicon");
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var Discusion = require('./models/discusion');
require('./models/db');

var user = require('./routes/student');
var tutor = require('./routes/tutor');
var setuppassport = require('./setuppassport');
var app = express();
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
setuppassport();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/student',session({
  name: 'student_sid',
  secret: "JHGF>,./?;;LJ8#$?,KL:>>>,,KJJJDHE",
  resave: true,
  saveUninitialized: true,
  cookie: {
    path: '/student',
  }
}));
app.use('/instructor',session({
  name: 'tutor_sid',
  secret: "JHGF>,./?;;LJ8#$?,KL:>>>,,KJJJDHE",
  resave: true,
  saveUninitialized: true,
  cookie: { 
    path: '/instructor',
  }
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/student', user);
app.use('/instructor', tutor);

io.on('connection', function (socket) {

 
  socket.on('new user', function(data) {
        
        var roomUsers = [];
        socket.user = data;
        var Room = data.course;
        //New user joins the default room
        socket.join(Room);

      var clents = io.sockets.adapter.rooms[Room];

       Object.keys(clents.sockets).forEach( function(socketId){
         var clentSocket = io.sockets.connected[socketId];
         roomUsers.push(clentSocket.user);
       })
      //  for (var clentId in clents){
        //  var clentSocket = io.sockets.connected[clentId];
         // var id = io.sockets.adapter.nsp.connected[clentId];
         // console.log(id);
       // }

        

        Discusion.find({ course: data.course }).
          populate('student').
          populate('tutor').
          exec(function(err, pmsgs) {
          if (err) { return next(err); }
           //Tell all those in the room that a new user joined
           io.in(Room).emit('user joined', {pmsgs:pmsgs, users:roomUsers});
        });
  
  });

   socket.on('new message', function(data) {

    if(!data.student){
      var newMsg = new Discusion({
        tutor: data.tutor,
        message: data.message,
        course: data.course
      });
    }else{
      var newMsg = new Discusion({
        student: data.student,
        message: data.message,
        course: data.course
      });
    }

     //Save it to database
    newMsg.save(function(err, msg){
      Discusion.findOne({ _id: msg._id }).
        populate('student').
        populate('tutor').
        exec(function(err, pmsg) {
        if (err) { return next(err); }
        //Send message to those connected in the room
        io.in(data.course).emit('message created', pmsg);
        console.log(pmsg);
      });
    });
  });





  socket.on('disconnect', function(){
      console.log('socket disconnected');
      var roomUsers = [];
      var room = socket.user.course;
      var clents = io.sockets.adapter.rooms[room];
      if(clents){
        Object.keys(clents.sockets).forEach( function(socketId){
           var clentSocket = io.sockets.connected[socketId];
           roomUsers.push(clentSocket.user);
        })
        io.in(room).emit('user disconnected', {users:roomUsers});
      }
      

  });
});

app.all('*', function(req, res) {
 res.redirect("/student");
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('student/error');
});



server.listen(8080);  
