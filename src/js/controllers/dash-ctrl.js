
angular
  .module('RhythmDashboard')
  .controller('DashCtrl', ['$scope', '$http', 'config', DashCtrl]);

function formatApiRequest(endpoint, config) {
  return config.apiUrl + "/" + endpoint + "/?token=" + config.apiToken
}

function DashCtrl($scope, $http, config) {
  $http.get(formatApiRequest("/meetings/count", config)).then(function (response) {
    $scope.meetingCount = response.data.data;
  })
  $http.get(formatApiRequest("/participants/count", config)).then(function (response) {
    $scope.userCount = response.data.data;
  })
  $http.get(formatApiRequest("/meetings/time", config)).then(function (response) {
    $scope.totalSpeakingTime = response.data.data;
  })
  $http.get(formatApiRequest("/meetings/turns", config)).then(function (response) {
    // get the aggregate meeting stats
    $scope.totalTurnsTaken = response.data.data;
  });

}
