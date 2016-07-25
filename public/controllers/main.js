angular.module('docAPPTapp')
  .controller("MainCtrl", ["$scope", "$window", function($scope, $window) {

    console.log("TOKEN VALUEL: " + $window.localStorage.token);

}])
