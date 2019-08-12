angular
.module('eApp')
.controller('profileCtrl', profileCtrl)
.controller('submitassignmentCtrl', submitassignmentCtrl);

function submitassignmentCtrl ($scope,$http,$route,$window,ngToast) {
  
   $scope.editorConfig ={
        toolbar: [
      { name: 'basicStyling', items: ['bold', 'italic', 'strikethrough', 'subscript', 'superscript', '-', 'leftAlign','-'] },
      { name: 'paragraph', items: ['orderedList', 'unorderedList', 'outdent', 'indent', '-'] },
      { name: 'doers', items: ['removeFormatting', 'undo', 'redo', '-'] },
      { name: 'links', items: ['symbols', 'link', 'unlink', '-'] },
      { name: 'styling', items: ['format'] },
        ]
    };

  $scope.assignment ={};
  $scope.btn = "Submit";
 
  $scope.submit = function(assignmentid, courseid){
     if($scope.assignment.content == null){
              ngToast.create({
                  className: 'danger',
                  content: "Enter assignment content in the 'Content' field."
              });
              return;
            }
     var uploadUrl =  "/student/courseview/"+assignmentid+"/submitassignment"
      $scope.btn = "Submiting...";
     var fd = new FormData();
     for(var key in $scope.assignment)
        fd.append(key, $scope.assignment[key]);
     $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
     }).then(function (response) {
        ngToast.create({
          className: 'success',
          content: 'Assignment has been successfully submited.',
        });
        $scope.btn ="Submit";
         setTimeout(function(){
             $window.location.href = "/student/courseview/"+courseid+"/assignment";
        }, 1000);
    }, function (error) {
          ngToast.create({
            className: 'danger',
            content: error.data.message,
          });
        $scope.btn = "Submit";
    });
  };

}

function profileCtrl ($scope,$http,socket,$route,$window,ngToast) {
	$scope.profile = {};
  $scope.btn = "Update"
	 $scope.update = function(isvalid){
      if(!isvalid){
        ngToast.create({
            className: 'danger',
            content: 'Fill the form properly!'
        });
        return;
      }
      $scope.btn = "Updating..."
           var uploadUrl = "/student/profile";
           var fd = new FormData();
           for(var key in $scope.profile)
           		fd.append(key, $scope.profile[key]);
           $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
           }).then(function (response) {
                ngToast.create({
                  className: 'success',
                  content: 'Profile updated!'
                });
                $window.location.href = "/student/profile";
                $scope.btn = "Update"
          }, function (error) {
               ngToast.create({
                  className: 'danger',
                  content: error.data
                });
                $scope.btn = "Update"
          });
        };

  socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });
  
}