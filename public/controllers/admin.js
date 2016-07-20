angular.module('docAPPTapp')
  .controller('AdminCtrl', function($scope, $http, $alert, $location) {

    $http({
      method: 'GET',
      url: '/api/v1/admin/submissions'
    }).then(function successCallback(response) {
      // returns array of data to scope
      $scope.submissions = response.data;
      console.log(response.data);
    }, function errorCallback(response) {
      $alert({
          content: 'Error Occured.',
          animation: 'fadeZoom',
          type: 'material',
          duration: 3
        });
    });

    $scope.acceptSubmission = function(id) {
  		$http.put('/api/v1/admin/approve/' + id)
  			.success(function(data) {
  				$location.path('/admin');
          $alert({
              content: 'Clinic Added',
              animation: 'fadeZoom',
              type: 'material',
              duration: 3
            });
  			})
  			.error(function(data) {
  				console.log('Error: ' + data);
          $alert({
              content: data,
              animation: 'fadeZoom',
              type: 'material',
              duration: 3
            });
  			});
  	};

    $scope.rejectSubmission = function(id) {
      $http.delete('/api/v1/admin/decline/' + id)
        .success(function(data) {
          $location.path('/admin');
          $alert({
              content: 'Clinic Rejected',
              animation: 'fadeZoom',
              type: 'material',
              duration: 3
            });
        })
        .error(function(data) {
          console.log('Error: ' + data);
          $alert({
              content: data,
              animation: 'fadeZoom',
              type: 'material',
              duration: 3
            });
        });
    };

});
