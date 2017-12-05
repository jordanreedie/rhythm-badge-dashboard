/**
 * Meeting Controller
 */

angular
  .module('RhythmDashboard')
  .controller('MeetingCtrl', ['$scope', '$http', 'config', MeetingCtrl]);

function MeetingCtrl($scope, $http, config) {
  $http.get(config.apiUrl + "/meetings/recent").then(function (response) {
    $scope.meeting = response.data.meeting_key;
  })

  // watch meeting and update if user selects a different one
  $scope.$watch("meeting", function(newValue, oldValue) {
    if ($scope.meeting !== undefined) {
      console.log($scope.meeting);
      updateMeetingMetadata();
      updateTimeSpoken();
      updateTurnsTaken();
    }
  });

  // get list of meetings
  $http.get(config.apiUrl + "/meetings/").then(function (response) {
    console.log(response.data);
    $scope.meetingList = response.data.map(function (item) { 
      var datetime = new Date(item.start_time * 1000)
      var dateStr = datetime.toDateString() + " " + datetime.toTimeString();
      return { meeting: item.meeting_key, date: dateStr };
    });

    console.log($scope.meetingList);
  })

  //TODO do we even want this
  function updateMeetingMetadata() {
    $http.get(config.apiUrl + "/meetings/" + $scope.meeting)
      .then(function (response) {
        var data = response.data
      });
  }

  function updateTimeSpoken() {
    $http.get(config.apiUrl + "/meetings/" + $scope.meeting + "/time")
      .then(function (response) {
        var data = chartifyData(response.data.data);
        data.series = "Seconds Spoken";
        $scope.totalSpeakingTime = data;
        console.log($scope.totalSpeakingTime);
      });
  }

  function updateTurnsTaken() {
    $http.get(config.apiUrl + "/meetings/" + $scope.meeting + "/turns")
      .then(function (response) {
        var data = chartifyData(response.data.data);
        data.series = "Turns Taken";
        $scope.totalSpeakingTurns = data;
      });
  }

  // we want the chart to start at 0 on the y-axis
  $scope.chartOptions = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero:true
        }
      }]
    }
  }

}

function chartifyData(data) {
  // convert the data given by the API to chartable data
  // given data is in format { data: { <participant>: <seconds>, ... } }
  console.log(data);
  var points = [];
  var labels = [];
  angular.forEach(data, function (value, key) {
    points.push(value);
    labels.push(key);
  });

  var result = {
    labels: labels,
    data: points
  };
  return result;
}
