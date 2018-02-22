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
  // get participant info
  $http.get(formatApiRequest("/participants/", config)).then(function (response) {
    $scope.participantMap = {}
    angular.forEach(response.data.data, function (val) {
      $scope.participantMap[val.participant_key] = val.name
    })
  });


  $scope.isCollapsed = false;
  $scope.collapseText = "Collapse";
  $scope.collapse = function () {
    $scope.isCollapsed = !$scope.isCollapsed;
    $scope.collapseText = $scope.isCollapsed ? "Expand" : "Collapse";
  }

  // watch meeting and update if user selects a different one
  $scope.$watch("meeting", function(newValue, oldValue) {
    if ($scope.meeting !== undefined) {
      updateTimeSpoken();
      updateTurnsTaken();
      updateIncrementalTimeSpoken();
      updateIncrementalTurnsTaken();
    }
  });


  // get list of meetings from server
  $http.get(formatApiRequest("/meetings/", config)).then(function (response) {
    $scope.meetingList = response.data.data.map(function (item) {
      // times are given as seconds.ms, convert to seconds
      var datetime = new Date(item.start_time * 1000)
      var dateStr = datetime.toDateString() + " " + datetime.toTimeString();
      // convert length from seconds to minutes (w/ one decimal place)
      var length = Math.round((item.end_time - item.start_time) * 10 / 60) / 10
      return { meeting: item.meeting_key, date: dateStr , len: length};
    });

    // sort the meetings so they show up in the table by recency (newest first)
    $scope.meetingList.sort(function(a,b) {
      return new Date(b.date) - new Date(a.date);
    });
  })

  $scope.setMeeting = function (mtg) {
    $scope.meeting = mtg;
  }

  $http.get(formatApiRequest("/meetings/recent/", config)).then(function (response) {
    $scope.meeting = response.data.data.meeting_key;
  })

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
        $scope.incrementSpeakingTime = data;
      });
  }

  function updateIncrementalTurnsTaken() {
    $http.get(formatApiRequest("/meetings/chunked_turns/" + $scope.meeting, config))
      .then(function (response) {
        var data = chartifyIncrementalData(response.data.data);
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
  function _replaceObjectKeys(toReplace, oldKeysToNew) {
    var newObj = {};
    angular.forEach(toReplace, function(val, key) {
      newObj[oldKeysToNew[key]] = val;
    });
    return newObj
  }

  function keysToNames(data) {
    var newData = []
    if (Array.isArray(data)) {
      angular.forEach(data, function(ele) {
        newData.push(_replaceObjectKeys(ele, $scope.participantMap))
      });
    } else {
      return _replaceObjectKeys(data, $scope.participantMap);
    }

    return newData;
  }

  function chartifyData(data) {
    // convert the data given by the API to chartable data
    // given data is in format { data: { <participant>: <seconds>, ... } }
    var namedData = keysToNames(data);
    var points = [];
    var labels = [];
    angular.forEach(namedData, function (value, key) {
      points.push(value);
      labels.push(key);
    });

    var result = {
      labels: labels,
      data: points
    };
    return result;
  }

  function getParticipants(data) {
    var names = [];
    angular.forEach(data, function(ele) {
      angular.forEach(ele, function(val, key) {
        if(!names.includes(key)) {
          names.push(key);
        }
      });
    });
    return names
  }

  function chartifyIncrementalData(data) {
    /*
    * data: [ { <participant>: <seconds>, ... }, ...]
    * where each element of the incoming array represents 5 minutes of speaking time
    *
    * returns: {
    *   data: [ [ y1, y2, y3, ...], [y'1, y'2, t'3, ...], ...] ],
    *   labels: [ "5 minutes", "10 minutes", ... ]
    *   series: [ <participant1>, <participant2>, ... ]
    * }
    */
    // TODO: This is gnarly. But it works for now.
    // I'll clean it up in a little, I swear.
    var namedData = keysToNames(data);
    var points = [];
    var labels = [];
    var i = 0;
    var label;
    var nameToIndex = {};
    var participantsInData = getParticipants(namedData);
    var series = [];
    // keep track of who belongs to what index of the data array
    angular.forEach(participantsInData, function(val) {
      nameToIndex[val] = i;
      series.push(val);
      points.push([]);
      i++;
    });

    angular.forEach(namedData, function (value, key) {
      i = 0;
      labelNum = (key + 1) * 5;
      labels.push(labelNum.toString() + " minutes");
      var keys_seen = [];
      angular.forEach(value, function(nested_val, nested_key) {
        // track who we've seen data from (see below)
        keys_seen.push(nested_key)
        // make sure we assign data to the correct user via nameToIndex
        points[nameToIndex[nested_key]].push(nested_val);
        i++;
      });

      // TODO change backend to return 0 if a participant does not speak in
      // an interval. For now, we account for that here
      angular.forEach(participantsInData, function(nested_val, nested_key) {
        // if we haven't seen this key it means the value is 0
        if (!keys_seen.includes(nested_val)) {
          points[nameToIndex[nested_val]].push(0);
          keys_seen.push(nested_val);
          i++;
        }
      });
    });


    var result = {
      labels: labels,
      data: points,
      series: series
    }

    return result
  }

}

