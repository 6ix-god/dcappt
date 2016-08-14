angular.module('docAPPTapp')
  .controller('searchCtrl', function($http, $scope, $stateParams) {

    var config = {
        params: {
          specialty: $stateParams.specialty,
          distance: $stateParams.distance,
          date: $stateParams.date,
          zipcode: $stateParams.zipCode
        }
    };

    $scope.searchedZip = $stateParams.zipCode;

    console.log(config);


    $http.get('/api/v1/clinic/locations/search', config).then(
    function(response) {
        console.log('get', response);
        $scope.results = response.data;
    },
    function(data) {
        console.log(data);
    });

});
