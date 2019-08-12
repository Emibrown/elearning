angular
.module('eApp')
.controller('editcourseCtrl', editcourseCtrl);

function editcourseCtrl ($scope,$http,$route,$window,ngToast) {
	 $scope.editorConfig ={
        toolbar: [
      { name: 'basicStyling', items: ['bold', 'italic', 'strikethrough', 'subscript', 'superscript', '-', 'leftAlign','-'] },
      { name: 'paragraph', items: ['orderedList', 'unorderedList', 'outdent', 'indent', '-'] },
      { name: 'doers', items: ['removeFormatting', 'undo', 'redo', '-'] },
      { name: 'links', items: ['symbols', 'link', 'unlink', '-'] },
      { name: 'styling', items: ['format'] },
        ]
    };

    $scope.course ={};
    $scope.btn ="Update";
        $scope.update = function(valid){
           if(!valid){
              ngToast.create({
                  className: 'danger',
                  content: 'Fill the form properly!'
              });
              return;
            }
            if($scope.course.dis == null){
              ngToast.create({
                  className: 'danger',
                  content: "Enter datails about this course in the 'Course Discription' field."
              });
              return;
            }
          $scope.btn ="Updating...";
           var uploadUrl = "/instructor/editcourse/"+$scope.course.id;
           var fd = new FormData();
           for(var key in $scope.course)
           		fd.append(key, $scope.course[key]);
           $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
           }).then(function (response) {
                ngToast.create({
                  className: 'success',
                  content: 'Course updated!',
                });
                $scope.btn ="Update";
               ngToast.create({
                  className: 'danger',
                  content: error.data.message,
                });
                $scope.btn ="Update";
          });
        };
}