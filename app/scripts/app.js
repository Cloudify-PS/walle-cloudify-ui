'use strict';

angular.module('cosmoUi', ['gsUiInfra'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/json', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/blueprints', {
                templateUrl: 'views/plansIndex.html',
                controller: 'PlansIndexCtrl'
            }).when('/blueprint',{
                templateUrl: 'views/plans.html',
                controller: 'PlansCtrl'
            }).otherwise({
                redirectTo: '/blueprints'
            });
    });
