angular
.module('eApp')
.controller('profileCtrl', profileCtrl);

function profileCtrl ($scope,$http,$route,$window,ngToast) {
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
      $scope.btn = "Updating...";
           var uploadUrl = "/instructor/profile";
           var fd = new FormData();
           for(var key in $scope.profile)
           		fd.append(key, $scope.profile[key]);
           $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
           }).then(function (response) {
                ngToast.create({
                  className: 'success',
                  content: 'Profile updated!',
                });
                $scope.btn = "Update";
                $window.location.href = "/instructor/profile";
          }, function (error) {
               ngToast.create({
                  className: 'danger',
                  content: error.data.message,
                });
                $scope.btn = "Update";
          });
        };
}