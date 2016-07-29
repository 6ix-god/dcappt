angular.module('docAPPTapp')
  .controller('doctorRegisterCtrl', function($http, $scope, $location, $alert) {

    $scope.submission = {};

    $scope.submissionForm = function() {

        $http.post('/api/v1/register/doctor', {
          clinicName: $scope.submission.clinicName,
          medicalLicenseNumber: $scope.submission.medicalLicenseNumber,
          zipCode: $scope.submission.zipCode,
          street: $scope.submission.street,
          city: $scope.submission.city,
          state: $scope.submission.state,
          phoneNumber: $scope.submission.phoneNumber,
          country: $scope.submission.country,
          description: $scope.submission.description // request requires logged in user
        }).then(function success(response) {
          $alert({
              content: response.data.message,
              animation: 'fadeZoom',
              type: 'material',
              duration: 5
            });
          $location.path('/');
        });

    };


});
