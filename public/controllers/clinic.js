angular.module('docAPPTapp')
  .controller('ClinicCtrl', function($anchorScroll, $scope, $http, $alert, $location, $route, $routeParams) {

    $anchorScroll();

    $http.get('/api/v1/clinic/' + $routeParams.id)
      .success(function(data) {

        $scope.clinic = data;
        $scope.doctors = data.doctors;

        console.log(data);

      })
      .error(function(data) {
        console.log('Error: ' + data);
        $alert({
            content: data.message,
            animation: 'fadeZoom',
            type: 'material',
            duration: 3
          });
      });

});
