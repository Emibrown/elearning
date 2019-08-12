angular
.module('eApp')
.controller('registerCtrl', registerCtrl);

function registerCtrl ($scope,$http,$route,$window,ngToast) {
	$scope.credentials = {
		  fullname: "",
		  username: "",
	    email : "",
	    password1: "",
	    password2: ""
	  };

     $scope.btn = "Register";

	  function studentlogin(){
      $scope.btn = "loading...";
      $http.post('/student/register', $scope.credentials)
          .then(function (response) {
                ngToast.create({
                  className: 'success',
                  content: 'Login successfully please wait....',
                });
                $scope.loading = false;
                $scope.showbtn = false;
                $window.location.href = "/student/login";
          }, function (error) {
               ngToast.create({
                  className: 'danger',
                  content: error.data.message,
                });
                $scope.loading = false;
                $scope.showbtn = false;
                $scope.btn = "Register";
          });
  }
  $scope.onSubmit = function(){
    $scope.loading = true;
    $scope.showbtn = true;
      studentlogin();
  }; 
	 
}