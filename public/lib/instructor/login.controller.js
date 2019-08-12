angular
.module('eApp')
.controller('tutorloginCtrl', tutorloginCtrl);

function tutorloginCtrl ($scope,$http,$route,$window,$location,ngToast) {
	$scope.credentials = {
    email : "",
    password: ""
  };

 $scope.btn = "Sign In";
 
 function instructorlogin(){
   $scope.btn = "loading...";
      $http.post('/instructor/login', $scope.credentials)
          .then(function (response) {
                ngToast.create({
                  className: 'success',
                  content: 'Login successfully please wait....',
                });
                $window.location.href = "/instructor/dashboard";
          }, function (error) {
               ngToast.create({
                  className: 'danger',
                  content: error.data.message,
                });
                $scope.loading = false;
                $scope.btn = "Sign In";
          });
  }
  $scope.onSubmit = function(){
    $scope.loading = true;
      instructorlogin();
  }; 


}