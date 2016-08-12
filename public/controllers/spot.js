angular.module('docAPPTapp')
  .controller('addSpotCtrl', function($scope, $http, moment, $alert, $location, $state) {

    var vm = this;
    vm.newTime = '';
    vm.add = add;
    vm.markAsComplete = markAsComplete;
    vm.markAsIncomplete = markAsIncomplete;
    vm.getTotalTasks = getTotalTasks;

    vm.tasks = [
      '8:30 AM',
      '9:00 AM',
      '9:30 AM',
      '10:00 AM',
      '10:30 AM',
      '12:00 PM',
      '12:30 PM',
      '1:00 PM'
    ];

    vm.completedTasks = [
      '11:00 AM',
      '11:30 AM'
    ];

    function add(task) {
      if ( task === '' || typeof task === 'undefined' ) {
        return false;
      }

      vm.tasks.push(task);
      vm.newTask = '';
    }

    function markAsComplete(index) {
      var task = vm.tasks[index];
      vm.tasks.splice(index, 1);
      vm.completedTasks.push(task);
    }

    function markAsIncomplete(index) {
      var task = vm.completedTasks[index];
      vm.completedTasks.splice(index, 1);
      vm.tasks.push(task);
    }

    function getTotalTasks() {
      return vm.tasks.length + vm.completedTasks.length;
    }

      // date picking

      vm.today = function() {
        vm.dt = new Date();
      };

      // run today() function
      vm.today();

      // setup clear
      vm.clear = function() {
        vm.dt = null;
      };

      // open min-cal
      vm.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        vm.opened = true;
      };

      // handle formats
      vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];

      // assign custom format
      vm.format = vm.formats[3];

      vm.submit = function() {
        var formattedDate = moment(vm.dt).format('MM-DD-YYYY');
        console.log("Formatted Date: " + formattedDate);
        console.log("Times for " + formattedDate + ": " + vm.tasks);

        $http.post('/api/v1/panel/spots/add', {
          times: vm.tasks,
          date: formattedDate
        }).then(function success(response) {

          $state.go('clinicPanel');

        });

      }

});
