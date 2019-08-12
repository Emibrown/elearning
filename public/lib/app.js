angular.module('eApp', ['ngRoute','ngToast','ngAnimate','ngSanitize','ngFileUpload','ngWYSIWYG','oitozero.ngSweetAlert']);
angular
  .module('eApp')
  .config(['ngToastProvider', function(ngToastProvider) {

    ngToastProvider.configure({
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      combineDuplications:true,
      additionalClasses: 'my-animation'
    });

  }]);
   angular
	.module('eApp')
	.directive('fileModel', ['$parse', function ($parse) {
        return {
           restrict: 'A',
           link: function(scope, element, attrs) {
              var model = $parse(attrs.fileModel);
              var modelSetter = model.assign;
              element.bind('change', function(){
                 scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                 });
              });
           }
        };
     }]);
   angular
	.module('eApp')
	.service('fileUpload', ['$http','$route','$window','ngToast', function ($http,$route,$window,ngToast) {
        this.uploadFileToUrl = function(file, uploadUrl){
           var fd = new FormData();
           for(var key in file)
           		fd.append(key, file[key]);
           $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
           });
        }
     }]);
  angular
  .module('eApp')
  .factory('socket', socket);

  function socket ($rootScope) {
      var socket = io.connect('127.0.0.1:8080');
        return {
          on: function(eventName, callback){
            socket.on(eventName, callback);
          },
          emit: function(eventName, data) {
            socket.emit(eventName, data);
          }
        };
  }
