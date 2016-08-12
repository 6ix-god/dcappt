angular.module('docAPPTapp', ['ngResource', 'ngMessages', 'ui.router', 'mgcrea.ngStrap', 'mwl.calendar', 'ui.bootstrap'])
  .config(function ($stateProvider, $locationProvider, $httpProvider, $urlRouterProvider) {

    $httpProvider.interceptors.push('AuthInterceptor');

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/home.html',
        controller: 'MainCtrl'
      })
      .state('clinic', {
        url: '/clinic/:id',
        templateUrl: 'views/clinic.html',
        controller: 'ClinicCtrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .state('register', {
        url: '/register',
        templateUrl: 'views/register.html',
        controller: 'SignupCtrl'
      })
      .state('register.doctor', {
        url: '/register/doctor',
        templateUrl: 'views/doctorRegister.html',
        controller: 'doctorRegisterCtrl'
      })
      .state('api', {
        url: '/api',
        templateUrl: 'views/api.html',
        controller: 'ApiCtrl'
      })
      .state('email-test', {
        url: '/email-test',
        templateUrl: 'views/searchtest.html',
        controller: 'MainCtrl'
      })
      .state('currentUser-test', {
        url: '/currentUser-test',
        templateUrl: 'views/currentUsertest.html',
        controller: 'currentUserCtrl'
      })
      .state('admin.submissions', {
        url: '/admin',
        templateUrl: 'views/admin.html',
        controller: 'AdminCtrl'
      })
      .state('clinicPanel', {
        url: '/panel/clinic',
        templateUrl: 'views/clinicPanel.html',
        controller: 'PanelCtrl'
      })
      .state('clinicPanel.requests', {
        url: '/panel/clinic/requests',
        templateUrl: 'views/clinicPanel/requests.html',
        controller: 'PanelCtrl'
      })
      .state('clinicPanel.calander', {
        url: '/panel/clinic/calander',
        templateUrl: 'views/clinicPanel/calander.html',
        controller: 'CalendarCtrl as vm'
      })
      .state('clinicPanel.addAppointment', {
        url: '/panel/clinic/add/appointment',
        templateUrl: 'views/clinicPanel/addAppointment.html',
        controller: 'addAppointmentCtrl'
      })
      .state('clinicPanel.addSpot', {
        url: '/panel/clinic/add/spot',
        templateUrl: 'views/clinicPanel/addSpot.html',
        controller: 'addSpotCtrl as vm'
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
