angular.module('docAPPTapp')
  .controller('LoginCtrl', function($scope, UserFactory, $rootScope, $window, AuthTokenFactory) {

    var token = $window.localStorage.token;
    if (token) {
      $rootScope.currentUser = true;
    }

    UserFactory.getUser().then(function success(response) {
      $scope.user = response.data;
    });

    $scope.login = function() {
      UserFactory.login($scope.email, $scope.password).then(function success(response) {
        $window.localStorage.setItem('token', response.data.token); // store token in local storage
      }, handleError);
    }

    function handleError(response) {
      alert('Error: ' + response.data);
    }

});

angular.module('docAPPTapp').factory('UserFactory', function UserFactory($alert, $http, AuthTokenFactory, $q, $location) {

    return {
      login: login,
      getUser: getUser
    };

    function login(username, password) {
      return $http.post('/api/v1/login', {
        email: username,
        password: password
      }).then(function success(response) {
        $location.path('/');
        $alert({
            content: 'Succsefully signed In',
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });
        return response;
      });
    }

    function getUser() {
        if (AuthTokenFactory.getToken()) {
        return $http.get('/api/v1/user/current');
      } else {
        return $q.reject({ data: 'client has no auth token' });
      }
    }
  });

  angular.module('docAPPTapp').factory('AuthTokenFactory', function AuthTokenFactory($window) {
    var store = $window.localStorage;
    var key = 'token';

    return {
      getToken: getToken,
      setToken: setToken
    };

    function getToken() {
      return store.getItem(key);
    }

    function setToken(token) {
      if (token) {
        store.setItem(key, token);
      } else {
        store.removeItem(key);
      }
    }
  });

angular.module('docAPPTapp').factory('AuthInterceptor', function AuthInterceptor(AuthTokenFactory, $window) {
    'use strict';
    return {
      request: addToken
    };

    function addToken(config) {
      var token = $window.localStorage.token;
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    }
  });
