'use strict';

angular.module('cosmoUiApp', [
    'gsUiInfraApp',
    'angularFileUpload',
    'ngCookies',
    'ngRoute',
    'ngSanitize',
    'ngResource',
    'ngBreadcrumbs',
    'elasticjs.service',
    'ngAnimate',
    'nvd3ChartDirectives',
    'ngStorage',
    'datePicker',
    'timer'

]).config(['$routeProvider', function ($routeProvider) {

        //var isSettingsExists = window.isSettingsExists();

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
                templateUrl: 'views/logs.html',
                controller: 'LogsCtrl'
            })
            .when('/hosts',{
                templateUrl: 'views/hosts.html',
                controller: 'HostsCtrl'
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
            .when('/interface', {
                templateUrl: 'views/interface.html',
                controller: 'InterfaceCtrl'
            })
            .when('/config', {
                templateUrl: 'views/config.html',
                controller: 'ConfigCtrl'
            })
            .otherwise({
//                redirectTo: isSettingsExists ? '/blueprints' : '/config'
                redirectTo: '/blueprints'
            });
    }])
    .value('appConfig', {
        versions: {
            ui: '0.0',
            manager: '0.0',
            latest: ''
        }
    })
    .run(['I18next', 'RestService', '$log', 'appConfig', function(I18next, RestService, $log, appConfig) {

        RestService.getConfiguration().then(function (data) {
            var i18nConf = data.i18n;
            if (i18nConf) {
                I18next.setOptions({
                    lng: i18nConf.language
                });
            }
        }, function () {
            $log.info('problem loading configuration for i18n init');
        });

        RestService.getVersionsUi()
            .then(function(data){
                if(data.hasOwnProperty('version')) {
                    appConfig.versions.ui = data.version;
                    RestService.checkVersion(data.version.split('.').join('')).then(function(ver) {
                        appConfig.versions.latest = ver;
                    });
                }
            });

        RestService.getVersionsManager()
            .then(function(data){
                if(data.hasOwnProperty('version')) {
                    appConfig.versions.manager = data.version;
                }
            });

    }]);
