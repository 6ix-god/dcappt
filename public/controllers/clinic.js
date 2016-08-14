angular.module('docAPPTapp')
  .controller('ClinicCtrl', function($anchorScroll, $scope, $http, $alert, $location, $stateParams, $uibModal, $log) {

    $scope.currentDate = new Date();

    $http.get('/api/v1/clinic/' + $stateParams.id)
      .success(function(data) {

        $scope.clinic = data;
        $scope.doctors = data.doctors;
        $scope.clinicData = data;

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

    $scope.book = function(time) {

      var dateToBook = moment($scope.dt).format('MM-DD-YYYY');

      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        size: 'lg',
        resolve: {
          bookingData: {
            date: dateToBook,
            time: time,
            clinicData: $scope.clinicData
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
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

})
.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, bookingData) {

  console.log(bookingData.date);
  console.log(bookingData.time);
  console.log(bookingData.clinicData);

  $scope.clinicData = bookingData.clinicData;
  $scope.date = bookingData.date;
  $scope.time = bookingData.time;
  $scope.formattedTime = moment(bookingData.time, 'MM-DD-yyyy').format("MMM Do YYYY");

  $scope.ok = function () {
    $uibModalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
