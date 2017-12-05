var app = angular.module('RhythmDashboard', ['chart.js', 'ui.bootstrap', 'ui.router', 'ngCookies']);

// TODO - move this into a config file or smth
app.constant('config', {
  apiUrl: 'http://localhost:4433'
});

