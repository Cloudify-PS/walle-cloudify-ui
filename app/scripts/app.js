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
    'pascalprecht.translate',
    'ngDialog',
    'ngProgress',
    'angular-loading-bar',
    'jsbb.angularTicker',
    'cloudifyjs'

]).config( function ($routeProvider, $httpProvider, $translateProvider) {

        //var isSettingsExists = window.isSettingsExists();

        // add translate module
        $translateProvider.useStaticFilesLoader({
            prefix: '/i18n/translations_',
            suffix: '.json'
        });

        $translateProvider.preferredLanguage('en');

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
            .when('/blueprint/:id/source', {
                templateUrl: 'views/blueprint/source.html',
                controller: 'SourceCtrl'
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
            .when('/deployment/:id/source', {
                templateUrl: 'views/deployment/source.html',
                controller: 'SourceCtrl'
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
                redirectTo: '/blueprints'
            });

        //initialize get if not there
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }

        //http://stackoverflow.com/questions/16098430/angular-ie-caching-issue-for-http
        // Answer edited to include suggestions from comments
        // because previous version of code introduced browser-related errors

        //disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
        // extra
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get.Pragma = 'no-cache';

        $httpProvider.interceptors.push('cloudifyLoginInterceptor');
    })
    .value('appConfig', {
        versions: {
            ui: '0.0',
            manager: '0.0'
        }
    });
