angular.module('docAPPTapp')
  .controller('SignupCtrl', function($http, $scope, $location, $alert) {

    $scope.registerForm = function() {

        $http.post('/api/v1/register', {
          email: $scope.register.email,
          password: $scope.register.password,
          firstName: $scope.register.firstName,
          lastName: $scope.register.lastName,
          zipCode: $scope.register.zipCode,
          street: $scope.register.street,
          city: $scope.register.city,
          state: $scope.register.state,
          country: $scope.register.country,
          gender: $scope.register.gender,
          phoneNumber: $scope.register.phoneNumber,
          dob: '2016-07-19T06:19:03.748Z'
        }).then(function success(response) {
          $alert({
              content: 'Account Created',
              animation: 'fadeZoom',
              type: 'material',
              duration: 5
            });
          $location.path('/login');
        });

    }

});
