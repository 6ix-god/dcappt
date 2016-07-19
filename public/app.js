angular.module('docAPPTapp', ['ngResource', 'ngMessages', 'ngRoute', 'ngAnimate', 'mgcrea.ngStrap'])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {

    $locationProvider.html5Mode(false);
    $httpProvider.interceptors.push('AuthInterceptor');

    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'MainCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'SignupCtrl'
      })
      .when('/api', {
        templateUrl: 'views/api.html',
        controller: 'ApiCtrl'
      })
      .when('/email-test', {
        templateUrl: 'views/searchtest.html',
        controller: 'MainCtrl'
      })
      .when('/currentUser-test', {
        templateUrl: 'views/currentUsertest.html',
        controller: 'currentUserCtrl'
      })
      .when('/register/doctor', {
        templateUrl: 'views/doctorRegister.html',
        controller: 'doctorRegisterCtrl'
      })
      .when('/admin', {
        templateUrl: 'views/admin.html',
        controller: 'AdminCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push(function ($rootScope, $q, $window, $location) {
      return {
        request: function(config) {
          if ($window.localStorage.token) {
            $rootScope.currentUser = true;
            config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
          }
          return config;
        },
        responseError: function(response) {
          if (response.status === 401 || response.status === 403) {
            $location.path('/login');
          }
          return $q.reject(response);
        }
      }
    });
  });
