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
    'timer',
    'ngProgress',
    'angular-loading-bar'

]).config( function ($routeProvider, $httpProvider) {

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
            .when('/blueprint/:blueprintId/topology', {
                templateUrl: 'views/blueprint/topology.html',
                controller: 'BlueprintTopologyCtrl'
            })
            .when('/blueprint/:blueprintId/network', {
                templateUrl: 'views/blueprint/network.html',
                controller: 'BlueprintNetworkCtrl'
            })
            .when('/blueprint/:blueprintId/nodes', {
                templateUrl: 'views/blueprint/nodes.html',
                controller: 'BlueprintNodesCtrl'
            })
            .when('/blueprint/:blueprintId/source', {
                templateUrl: 'views/blueprint/source.html',
                controller: 'BlueprintSourceCtrl'
            })
            .when('/deployments',{
                templateUrl: 'views/deployments.html',
                controller: 'DeploymentsCtrl'
            })
            .when('/deployment/:deploymentId/monitoring', {
                templateUrl: 'views/deployment/monitoring.html',
                controller: 'DeploymentMonitoringCtrl'
            })
            .when('/deployment/:deploymentId/topology', {
                templateUrl: 'views/deployment/topology.html',
                controller: 'DeploymentTopologyCtrl'
            })
            .when('/deployment/:deploymentId/network', {
                templateUrl: 'views/deployment/network.html',
                controller: 'DeploymentNetworkCtrl'
            })
            .when('/deployment/:deploymentId/nodes', {
                templateUrl: 'views/deployment/nodes.html',
                controller: 'DeploymentNodesCtrl'
            })
            .when('/deployment/:deploymentId/executions', {
                templateUrl: 'views/deployment/executions.html',
                controller: 'DeploymentExecutionsCtrl'
            })
            .when('/deployment/:deploymentId/events', {
                templateUrl: 'views/deployment/events.html',
                controller: 'DeploymentEventsCtrl'
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
            .when('/grafana', {
                templateUrl: 'views/grafana.html'
            })
            .when('/config', {
                templateUrl: 'views/config.html',
                controller: 'ConfigCtrl'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .otherwise({
//                redirectTo: isSettingsExists ? '/blueprints' : '/config'
                redirectTo: '/blueprints'
            });

        $httpProvider.interceptors.push('cloudifyLoginInterceptor');
    })
    .value('appConfig', {
        versions: {
            ui: '0.0',
            manager: '0.0'
        }
    })
    .run(['I18next', 'CloudifyService', '$log', 'appConfig', function(I18next, CloudifyService, $log) {

        CloudifyService.getConfiguration().then(function (data) {
            if ( !data ){
                data = { 'i18n' : {
                    'language' : 'en'
                }};
            }
            var i18nConf = data.i18n;
            if (i18nConf) {
                I18next.setOptions({
                    lng: i18nConf.language
                });
            }
        }, function () {
            $log.info('problem loading configuration for i18n init');
        });
    }]);
