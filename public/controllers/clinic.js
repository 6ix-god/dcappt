angular.module('docAPPTapp')
  .controller('ClinicCtrl', function($anchorScroll, $scope, $http, $alert, $location, $stateParams) {

    $scope.currentDate = new Date();

    $http.get('/api/v1/clinic/' + $stateParams.id)
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

  $scope.getSpots = function() {
      $http.get('/api/v1/clinic/times/' + $stateParams.id + '/' + moment($scope.dt).format('MM-DD-YYYY'))
        .success(function(data) {
          $scope.times = data.times;
          $scope.error = null;
        })
        .error(function(data) {
          console.log('Error: ' + data);
          $scope.times = null;
          $scope.error = data.message;
        });
    }

    // date picking

    $scope.today = function() {
      $scope.dt = new Date();
    };

    // run today() function
    $scope.today();

    // setup clear
    $scope.clear = function() {
      $scope.dt = null;
    };

    // open min-cal
    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened = true;
    };

    // handle formats
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];

    // assign custom format
    $scope.format = $scope.formats[3];

});
