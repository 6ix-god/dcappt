angular.module('docAPPTapp')
  .controller('AdminCtrl', function($scope, $http, $alert) {

    // http get submissions
    $http.get("/api/v1/admin/submissions")
    .then(function(response) {
      console.log(response.data);
      // returns array of data to scope
      $scope.submissions = response.data;
    });

    $http({
      method: 'GET',
      url: '/api/v1/admin/submissions'
    }).then(function successCallback(response) {
      // returns array of data to scope
      $scope.submissions = response.data;
    }, function errorCallback(response) {
      $alert({
          content: 'Error Occured.',
          animation: 'fadeZoom',
          type: 'material',
          duration: 3
        });
    });

});
