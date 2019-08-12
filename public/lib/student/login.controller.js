angular
.module('eApp')
.controller('loginCtrl', loginCtrl);

function loginCtrl ($scope,$http,$route,$window,$location,ngToast) {
  $scope.credentials = {
    username : "",
    password: ""
  };

  $scope.btn = "Sign In";

 function studentlogin(){
      $scope.btn = "Loading...";
      $http.post('/student/login', $scope.credentials)
          .then(function (response) {
                ngToast.create({
                  className: 'success',
                  content: 'Login successfully please wait....',
                });
                $scope.loading = false;
                $scope.showbtn = false;
                $window.location.href = "/student/dashboard";
          }, function (error) {
               ngToast.create({
                  className: 'danger',
                  content: error.data.message,
                });
                $scope.loading = false;
                $scope.showbtn = false;
                $scope.btn = "Sign In";
          });
  }
  $scope.onSubmit = function(){
    $scope.loading = true;
    $scope.showbtn = true;
      studentlogin();
  }; 


}