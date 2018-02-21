/**
 * Meeting Controller
 */

angular
  .module('RhythmDashboard')
  .controller('MeetingCtrl', ['$scope', '$http', 'config', MeetingCtrl]);

function formatApiRequest(endpoint, config) {
  return config.apiUrl + endpoint + "?token=" + config.apiToken
}

function MeetingCtrl($scope, $http, config) {
  $http.get(formatApiRequest("/meetings/recent/", config)).then(function (response) {
    $scope.meeting = response.data.data.meeting_key;
  })

  $scope.isCollapsed = false;
  $scope.collapseText = "Collapse";
  $scope.collapse = function () {
    $scope.isCollapsed = !$scope.isCollapsed;
    $scope.collapseText = $scope.isCollapsed ? "Expand" : "Collapse";
  }

  // watch meeting and update if user selects a different one
  $scope.$watch("meeting", function(newValue, oldValue) {
    if ($scope.meeting !== undefined) {
      console.log($scope.meeting);
      updateTimeSpoken();
      updateTurnsTaken();
      updateIncrementalTimeSpoken();
      updateIncrementalTurnsTaken();

    }
  });

  // get list of meetings
  $http.get(formatApiRequest("/meetings/", config)).then(function (response) {
    console.log(response.data.data);
    $scope.meetingList = response.data.data.map(function (item) { 
      var datetime = new Date(item.start_time * 1000)
      var dateStr = datetime.toDateString() + " " + datetime.toTimeString();
      console.log(item)
      var length = Math.round((item.end_time - item.start_time) * 10 / 60) / 10
      console.log(length)
      return { meeting: item.meeting_key, date: dateStr , len: length};
    });

    $scope.meetingList.sort(function(a,b) {
      return new Date(b.date) - new Date(a.date);
    });

    console.log($scope.meetingList);
  })
  
  $scope.setMeeting = function (mtg) {
    $scope.meeting = mtg;
  }

  function updateTimeSpoken() {
    $http.get(formatApiRequest("/meetings/time/" + $scope.meeting, config))
      .then(function (response) {
        var data = chartifyData(response.data.data);
        data.series = "Seconds Spoken";
        $scope.totalSpeakingTime = data;
      });
  }

  function updateTurnsTaken() {
    $http.get(formatApiRequest("/meetings/turns/" + $scope.meeting, config))
      .then(function (response) {
        var data = chartifyData(response.data.data);
        data.series = "Turns Taken";
        $scope.totalSpeakingTurns = data;
      });
  }

  function updateIncrementalTimeSpoken() {
    $http.get(formatApiRequest("/meetings/chunked_time/" + $scope.meeting, config))
      .then(function (response) {
        var data = chartifyIncrementalData(response.data.data);
        data.series = "Seconds Spoken";
        $scope.incrementSpeakingTime = data;
      });
  }

  function updateIncrementalTurnsTaken() {
    $http.get(formatApiRequest("/meetings/chunked_turns/" + $scope.meeting, config))
      .then(function (response) {
        var data = chartifyIncrementalData(response.data.data);
        data.series = "Turns Taken";
        $scope.incrementSpeakingTurns = data;
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

function chartifyIncrementalData(data) {
  // data: [ { <part>: <seconds>, ... }, ]
  var points = [[],[],[],[]];
  var labels = [];
  var i;
  var label;
  angular.forEach(data, function (value, key) {
    i = 0;
    labelNum = (key + 1) * 5
    labels.push(labelNum.toString() + " minutes")
    angular.forEach(value, function(nested_val, nested_key) {
      points[i].push(nested_val); 
      i++;
    });

  }); 

  var result = {
    labels: labels,
    data: points
  }

  return result
}
