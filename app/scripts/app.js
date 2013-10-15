'use strict';

angular.module('cosmoUi', [])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/json', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/', {
                templateUrl: 'views/plans.html',
                controller: 'PlansCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
