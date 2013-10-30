'use strict';

angular.module('cosmoUi', ['gsUiInfra'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/json', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/plans', {
                templateUrl: 'views/plansIndex.html',
                controller: 'PlansIndexCtrl'
            }).when('/plan',{
                templateUrl: 'views/plans.html',
                controller: 'PlansCtrl'
            }).otherwise({
                redirectTo: '/plans'
            });
    });
