angular.module('docAPPTapp')
  .controller('CalendarCtrl', ["$scope", "moment", "alert", function($scope, moment, alert) {

    var vm = this;

    //These variables MUST be set as a minimum for the calendar to work
    vm.calendarView = 'month';
    vm.viewDate = new Date();
    vm.events = [
      {
        title: 'Event 1',
        type: 'info',
        startsAt: moment().startOf('week').subtract(2, 'days').add(8, 'hours').toDate(),
      }, {
        title: 'Event 2',
        type: 'info',
        startsAt: moment().subtract(1, 'day').toDate(),
      }, {
        title: 'Event 3',
        type: 'info',
        startsAt: moment().startOf('day').add(7, 'hours').toDate(),
        recursOn: 'year',
      }
    ];

    vm.isCellOpen = true;

    vm.eventClicked = function(event) {
      alert.show('Clicked', event);
    };

    vm.eventEdited = function(event) {
      alert.show('Edited', event);
    };

    vm.eventDeleted = function(event) {
      alert.show('Deleted', event);
    };

    vm.eventTimesChanged = function(event) {
      alert.show('Dropped or resized', event);
    };

    vm.toggle = function($event, field, event) {
      $event.preventDefault();
      $event.stopPropagation();
      event[field] = !event[field];
    };


}]);
