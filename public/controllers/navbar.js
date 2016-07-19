angular.module('docAPPTapp')
  .controller('NavbarCtrl', function($scope, UserFactory, $location, $window, $rootScope, $alert) {
    $scope.logout = function() {
      delete $window.localStorage.token;
      $rootScope.currentUser = null;
      $alert({
          content: 'You have been logged out.',
          animation: 'fadeZoom',
          type: 'material',
          duration: 3
        });
      $location.path('/');
    };
  });
