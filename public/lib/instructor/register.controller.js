angular
.module('eApp')
.controller('tutorRegisterCtrl', tutorRegisterCtrl);

function tutorRegisterCtrl ($scope,$http,$route,$window,ngToast) {
	$scope.credentials = {
	    firstname: "",
      lastname: "",
	    email : "",
	    password1: "",
	    password2: ""
	  };

    $scope.btn = "Register";

	  function instructorlogin(){
      $scope.btn = "Loading...";

      $http.post('/instructor/register', $scope.credentials)
          .then(function (response) {
                ngToast.create({
                  className: 'success',
                  content: 'Login successfully please wait....',
                });
                $scope.loading = false;
                $scope.showbtn = false;
                $window.location.href = "/instructor/login";
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
      instructorlogin();
  }; 
}