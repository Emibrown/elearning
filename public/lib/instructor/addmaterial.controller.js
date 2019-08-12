angular
.module('eApp')
.controller('addmaterialCtrl', addmaterialCtrl)
.controller('addassignmentCtrl', addassignmentCtrl)
.controller('editassignmentCtrl', editassignmentCtrl);



function addmaterialCtrl ($scope,$http,$route,$window,ngToast) {
		$scope.material ={};
    $scope.btn = "Add";
        $scope.create = function(courseid, valid){
           if(!valid){
              ngToast.create({
                  className: 'danger',
                  content: 'Fill the form properly!'
              });
              return;
            }
            if($scope.material.dis == null){
              ngToast.create({
                  className: 'danger',
                  content: "Enter datails about this material in the 'Content' field."
              });
              return;
            }
             $scope.btn = "Adding...";
           var uploadUrl = "/instructor/courseview/"+courseid+"/addmaterial";
           var fd = new FormData();
           for(var key in $scope.material)
           		fd.append(key, $scope.material[key]);
           $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
           }).then(function (response) {
                ngToast.create({
                  className: 'success',
                  content: response.data.message,
                });
                 $scope.btn = "Add";
                 setTimeout(function(){
                     $window.location.href = "/instructor/courseview/"+courseid+"/material";
                }, 1000);
          }, function (error) {
               ngToast.create({
                  className: 'danger',
                  content: error.data.message,
                });
                $scope.btn = "Add";
          });
        };
}

function addassignmentCtrl ($scope,$http,$route,$window,ngToast) {
    $scope.assignment ={};
    $scope.btn = "Add";
        $scope.create = function(courseid, valid){
           if(!valid){
              ngToast.create({
                  className: 'danger',
                  content: 'Fill the form properly!'
              });
              return;
            }
            if($scope.assignment.content == null){
              ngToast.create({
                  className: 'danger',
                  content: "Enter datails about this material in the 'Content' field."
              });
              return;
            }
             $scope.btn = "Adding...";
           var uploadUrl = "/instructor/courseview/"+courseid+"/addassignment";
           var fd = new FormData();
           for(var key in $scope.assignment)
              fd.append(key, $scope.assignment[key]);
           $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
           }).then(function (response) {
                ngToast.create({
                  className: 'success',
                  content: response.data.message,
                });
                 $scope.btn = "Add";
                 setTimeout(function(){
                     $window.location.href = "/instructor/courseview/"+courseid+"/assignment";
                }, 1000);
          }, function (error) {
               ngToast.create({
                  className: 'danger',
                  content: error.data.message,
                });
                $scope.btn = "Add";
          });
        };
}

function editassignmentCtrl ($scope,$http,$route,$window,ngToast) {


    $scope.assignment ={};
    $scope.init = function(value) {
        $scope.assignment.date = new Date(value);
    }
    $scope.btn = "Add";
        $scope.create = function(assignmentid, courseid, valid){
           if(!valid){
              ngToast.create({
                  className: 'danger',
                  content: 'Fill the form properly!'
              });
              return;
            }
            if($scope.assignment.content == null){
              ngToast.create({
                  className: 'danger',
                  content: "Enter datails about this material in the 'Content' field."
              });
              return;
            }
             $scope.btn = "Adding...";
           var uploadUrl = "/instructor/courseview/"+assignmentid+"/editassignment";
           var fd = new FormData();
           for(var key in $scope.assignment)
              fd.append(key, $scope.assignment[key]);
           $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
           }).then(function (response) {
                ngToast.create({
                  className: 'success',
                  content: response.data.message,
                });
                 $scope.btn = "Add";
                 setTimeout(function(){
                     $window.location.href = "/instructor/courseview/"+courseid+"/assignment";
                }, 1000);
          }, function (error) {
               ngToast.create({
                  className: 'danger',
                  content: error.data.message,
                });
                $scope.btn = "Add";
          });
        };
}