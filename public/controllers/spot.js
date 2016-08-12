angular.module('docAPPTapp')
  .controller('addSpotCtrl', function($scope, $http) {

    var vm = this;
    vm.newTime = '';
    vm.add = add;
    vm.markAsComplete = markAsComplete;
    vm.markAsIncomplete = markAsIncomplete;
    vm.getTotalTasks = getTotalTasks;
    vm.calculatePercent = calculatePercent;

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

    function calculatePercent(count) {
      var total = vm.getTotalTasks();
      return Math.round(100 / total * count);
    }

});
