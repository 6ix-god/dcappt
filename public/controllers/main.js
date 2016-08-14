angular.module('docAPPTapp')
  .controller("MainCtrl", ["$scope", "$window", "$state",function($scope, $window, $state) {

    console.log("TOKEN VALUEL: " + $window.localStorage.token);

    $scope.homeSearch = function() {

      console.log('lol');

      $state.go('search', {
        specialty: $scope.specialty,
        distance: $scope.distance,
        date: $scope.date,
        zipCode: $scope.zipCode
      });

    }

}])
