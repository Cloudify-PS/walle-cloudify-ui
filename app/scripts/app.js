'use strict';

angular.module('cosmoUiApp', [
    'gsUiInfraApp',
    'angularFileUpload',
    'ngRoute',
    'ngSanitize',
    'elasticjs.service',
    'ngAnimate',
    'ngStorage',
    'timer',
    'pascalprecht.translate',
    'ngDialog',
    'ngProgress',
    'angular-loading-bar',
    'jsbb.angularTicker',
    'cloudifyjs',
    'ui.bootstrap',
    'smart-table',
    'angularMoment',
    'datePicker',
    'dndLists'
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
                controller: 'BlueprintsIndexCtrl',
                reloadOnSearch: false
            })
            .when('/blueprint/:blueprintId/topology', {
                templateUrl: 'views/blueprint/blueprintTopology.html',
                controller: 'BlueprintTopologyCtrl'
            })
            .when('/blueprint/:blueprintId/network', {
                templateUrl: 'views/blueprint/blueprintNetwork.html',
                controller: 'BlueprintNetworkCtrl'
            })
            .when('/blueprint/:blueprintId/nodes', {
                templateUrl: 'views/blueprint/blueprintNodes.html',
                controller: 'BlueprintNodesCtrl'
            })
            .when('/blueprint/:blueprintId/source', {
                templateUrl: 'views/blueprint/blueprintSource.html',
                controller: 'SourceCtrl'
            })
            .when('/deployments',{
                templateUrl: 'views/deployment/deploymentsIndex.html',
                controller: 'DeploymentsCtrl'
            })
            .when('/deployment/:deploymentId/monitoring', {
                templateUrl: 'views/deployment/deploymentMonitoring.html',
                controller: 'DeploymentMonitoringCtrl'
            })
            .when('/deployment/:deploymentId/topology', {
                templateUrl: 'views/deployment/deploymentTopology.html',
                controller: 'DeploymentTopologyCtrl'
            })
            .when('/deployment/:deploymentId/network', {
                templateUrl: 'views/deployment/deploymentNetwork.html',
                controller: 'DeploymentNetworkCtrl'
            })
            .when('/deployment/:deploymentId/nodes', {
                templateUrl: 'views/deployment/deploymentNodes.html',
                controller: 'DeploymentNodesCtrl'
            })
            .when('/deployment/:deploymentId/executions', {
                templateUrl: 'views/deployment/deploymentExecutions.html',
                controller: 'DeploymentExecutionsCtrl'
            })
            .when('/deployment/:deploymentId/inputs-outputs', {
                templateUrl: 'views/deployment/deploymentInputsOutputs.html',
                controller: 'InputsOutputsCtrl'
            })
            .when('/deployment/:deploymentId/events', {
                templateUrl: 'views/deployment/events.html',
                controller: 'DeploymentEventsCtrl'
            })
            .when('/deployment/:deploymentId/source', {
                templateUrl: 'views/deployment/deploymentSource.html',
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
