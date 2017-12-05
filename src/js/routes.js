'use strict';

/**
 * Route configuration for the RhythmDashboard module.
 */
angular.module('RhythmDashboard').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        // For unmatched routes
        $urlRouterProvider.otherwise('/');

        // Application routes
        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: 'templates/dashboard.html'
            })
            .state('meetings', {
                url: '/meetings',
                templateUrl: 'templates/meetings.html'
            });
    }
]);
