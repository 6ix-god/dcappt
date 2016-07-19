angular.module('docAPPTapp')
  .controller('currentUserCtrl', function($scope, $http) {

    // $scope.pageClass = 'fadeZoom';

    $http.get("/api/v1/user/current")
    .then(function(response) {

        var x = response.data.dateCreated; // 2016-07-14T01:09:06+00:00 ~ Date (ISO 8601)

        var MM = {Jan:"January", Feb:"February", Mar:"March", Apr:"April", May:"May", Jun:"June", Jul:"July", Aug:"August", Sep:"September", Oct:"October", Nov:"November", Dec:"December"}

        var xx = String(new Date(x)).replace(
            /\w{3} (\w{3}) (\d{2}) (\d{4}) (\d{2}):(\d{2}):[^(]+\(([A-Z]{3})\)/,
            function($0,$1,$2,$3,$4,$5,$6){
                return MM[$1]+" "+$2+", "+$3+" - "+$4%12+":"+$5+(+$4>12?"PM":"AM")+" "+$6
            }
        )

        $scope.fDob = response.data.dateCreated; // formated date => Wed Jul 13 2016 18:09:06 GMT-0700 (Pacific Daylight Time)
        $scope.user = response.data;
    });

});
