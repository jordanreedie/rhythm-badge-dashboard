
angular
  .module('RhythmDashboard')
  .controller('DashCtrl', ['$scope', '$http', 'config', DashCtrl]);

function DashCtrl($scope, $http, config) {
  $http.get(config.apiUrl + "/meetings/stats").then(function (response) {
    // get the aggregate meeting stats
    var data = response.data
    $scope.userCount = data.participantCount;
    $scope.meetingCount = data.meetingCount;
    $scope.totalSpeakingTime = data.speakingTime;
    $scope.totalTurnsTaken = data.turnsTaken;
  });

}
