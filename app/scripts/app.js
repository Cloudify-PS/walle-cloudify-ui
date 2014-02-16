'use strict';

angular.module('cosmoUi', ['gsUiInfraApp', 'angularFileUpload', 'ngCookies', 'ngRoute', 'ngSanitize', 'ngResource', 'ngBreadcrumbs'])

    .config(['$routeProvider', function ($routeProvider) {

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
            .when('/monitoring',{
                templateUrl: 'views/blueprintsIndex.html'
            })
            .when('/logs',{
                templateUrl: 'views/blueprintsIndex.html'
            })
            .when('/hosts',{
                templateUrl: 'views/blueprintsIndex.html'
            })
            .when('/networks',{
                templateUrl: 'views/blueprintsIndex.html'
            })
            .when('/floating-ips',{
                templateUrl: 'views/blueprintsIndex.html'
            })
            .when('/storage',{
                templateUrl: 'views/blueprintsIndex.html'
            })
            .when('/config', {
                templateUrl: 'views/config.html',
                controller: 'ConfigCtrl'
            })
            .otherwise({
                redirectTo: isSettingsExists ? '/blueprints' : '/config'
            });
    }]).run(['I18next', 'RestService', function(I18next, RestService) {

        RestService.getConfiguration().then(function (data) {
            var i18nConf = data.i18n;
            if (i18nConf) {
                I18next.setOptions({
                    lng: i18nConf.language
                });
            }
        }, function () {
            console.log('problem loading configuration for i18n init');
        });

    }]);
