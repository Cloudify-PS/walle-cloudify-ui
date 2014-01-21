'use strict';

angular.module('cosmoUi', ['gsUiInfra', 'angularFileUpload', 'ngCookies', 'ngRoute','ngSanitize', 'ngResource'])
    .config(function ($routeProvider) {
        var isSettingsExists = window.isSettingsExists();

        $routeProvider
            .when('/json', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/blueprints', {
                templateUrl: 'views/blueprintsIndex.html',
                controller: 'BlueprintsIndexCtrl'
            })
            .when('/blueprint',{
                templateUrl: 'views/plans.html',
                controller: 'PlansCtrl'
            })
            .when('/deployments',{
                templateUrl: 'views/deployments.html',
                controller: 'DeploymentsCtrl'
            })
            .when('/deployment',{
                templateUrl: 'views/deployment.html',
                controller: 'DeploymentCtrl'
            })
//            .when('/events',{
//                templateUrl: 'views/events.html',
//                controller: 'EventsCtrl'
//            })
            .when('/monitoring',{
                templateUrl: 'views/plans.html'
            })
            .when('/logs',{
                templateUrl: 'views/plans.html'
            })
            .when('/hosts',{
                templateUrl: 'views/plans.html'
            })
            .when('/networks',{
                templateUrl: 'views/plans.html'
            })
            .when('/floating-ips',{
                templateUrl: 'views/plans.html'
            })
            .when('/storage',{
                templateUrl: 'views/plans.html'
            })
            .when('/config', {
                templateUrl: 'views/config.html',
                controller: 'ConfigCtrl'
            })
            .otherwise({
                redirectTo: isSettingsExists ? '/blueprints' : '/config'
            });
    });
