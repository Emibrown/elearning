angular
.module('eApp')
.controller('discusionCtrl',discusionCtrl);

function discusionCtrl ($scope, $timeout,$http,socket,$route,$window,ngToast) {
	
  $scope.messages = [];
  $scope.users = [];
  $scope.init = function(course, id, title, firstname, avater) {
       socket.emit('new user', {
            user: title+". "+ firstname,
            course: course,
            avater: avater
        });
       $scope.user = id;
  }
 $scope.send = function (course,tutor) {

     if($scope.message == "" || $scope.message == null){
          return;
     }
      //Notify the server that there is a new message with the message as packet
      socket.emit('new message', {
          course: course,
          message: $scope.message,
          tutor: tutor
      });

      $scope.message = "";
  };

 
  socket.on('user joined', function (data) {
       $scope.$apply(function(){
         $scope.messages = data.pmsgs;
         $scope.users = data.users;
      });
      $timeout(function() {
          document.body.scrollTop = getDocHeight();
          document.documentElement.scrollTop = getDocHeight();
      }, 0, false);
  });

    socket.on('message created', function (data) {
        //Push to new message to our $scope.messages
        $scope.$apply(function(){
         $scope.messages.push(data);
        });
        $timeout(function() {
            document.body.scrollTop = getDocHeight();
            document.documentElement.scrollTop = getDocHeight();
        }, 0, false);
    });

    socket.on('user disconnected', function (data) {
       $scope.$apply(function(){
         $scope.users = data.users;
      });
  });
    
    function getDocHeight(){
      var D = document;
      return Math.max(
            Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
            Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
            Math.max(D.body.clientHeight, D.documentElement.scrollHeight)
        );
    }
}