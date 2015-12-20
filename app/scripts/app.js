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
    'dndLists',
    'cfy.topology',
    'datePicker',
    'ui.router'
]).config( function ($httpProvider, $translateProvider, $provide, $stateProvider, $urlRouterProvider) {

        //var isSettingsExists = window.isSettingsExists();

        // add translate module
        $translateProvider.useStaticFilesLoader({
            prefix: '/i18n/translations_',
            suffix: '.json'
        });

        $translateProvider.preferredLanguage('en');

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .state('cloudifyLayout',{
                templateUrl: 'views/cloudifyLayoutTemplate.html',
                controller: 'CloudifyLayoutCtrl'
            })
            .state('cloudifyLayout.blueprints',{
                url: '/blueprints' +
                '?pageNobp1' +
                '&sortBybp1' +
                '&reversebp1' +
                '&idbp1',
                params: {
                    idbp1: {
                        value: ''
                    }
                },
                templateUrl: 'views/blueprintsIndex.html',
                controller: 'BlueprintsIndexCtrl',
                reloadOnSearch: false
            })
            .state('cloudifyLayout.blueprintLayout',
            {
                url:'/blueprint/:blueprintId',
                abstract: true,
                templateUrl: 'views/blueprint/blueprintLayout.html',
                controller: 'BlueprintLayoutCtrl'
            })
            .state('cloudifyLayout.blueprintLayout.topology', {
                url: '/topology',
                templateUrl: 'views/blueprint/blueprintTopology.html',
                controller: 'BlueprintTopologyCtrl'
            })
            .state('cloudifyLayout.blueprintLayout.nodes', {
                url: '/nodes',
                templateUrl: 'views/blueprint/blueprintNodes.html',
                controller: 'BlueprintNodesCtrl'
            })
            .state('cloudifyLayout.blueprintLayout.source', {
                url: '/source',
                templateUrl: 'views/blueprint/blueprintSource.html',
                controller: 'SourceCtrl'
            })
            .state('cloudifyLayout.deployments', {
                url: '/deployments'+
                    '?pageNodp1' +
                    '&sortBydp1' +
                    '&reversedp1' +
                    '&iddp1' +
                    '&blueprint_iddp1',
                params: {
                    iddp1: {
                        value: ''
                    },
                    blueprint_iddp1: {
                        value: ''
                    }
                },
                templateUrl: 'views/deployment/deploymentsIndex.html',
                controller: 'DeploymentsCtrl',
                reloadOnSearch: false
            })
            .state('cloudifyLayout.deploymentLayout',
            {
                url:'/deployment/:deploymentId',
                abstract: true,
                templateUrl: 'views/deployment/deploymentLayout.html',
                controller: 'DeploymentLayoutCtrl'
            })
            .state('cloudifyLayout.deploymentLayout.monitoring', {
                url: '/monitoring',
                templateUrl: 'views/deployment/deploymentMonitoring.html',
                controller: 'DeploymentMonitoringCtrl'
            })
            .state('cloudifyLayout.deploymentLayout.topology', {
                url: '/topology',
                templateUrl: 'views/deployment/deploymentTopology.html',
                controller: 'DeploymentTopologyCtrl'
            })
            .state('cloudifyLayout.deploymentLayout.network', {
                url: '/network',
                templateUrl: 'views/deployment/deploymentNetwork.html',
                controller: 'DeploymentNetworkCtrl'
            })
            .state('cloudifyLayout.deploymentLayout.nodes', {
                url: '/nodes',
                templateUrl: 'views/deployment/deploymentNodes.html',
                controller: 'DeploymentNodesCtrl'
            })
            .state('cloudifyLayout.deploymentLayout.executions', {
                url: '/executions',
                templateUrl: 'views/deployment/deploymentExecutions.html',
                controller: 'DeploymentExecutionsCtrl'
            })
            .state('cloudifyLayout.deploymentLayout.inputsOutputs', {
                url: '/inputs-outputs',
                templateUrl: 'views/deployment/deploymentInputsOutputs.html',
                controller: 'InputsOutputsCtrl'
            })
            .state('cloudifyLayout.deploymentLayout.events', {
                url: '/events',
                templateUrl: 'views/deployment/events.html',
                controller: 'DeploymentEventsCtrl'
            })
            .state('cloudifyLayout.deploymentLayout.source', {
                url: '/source',
                templateUrl: 'views/deployment/deploymentSource.html',
                controller: 'SourceCtrl'
            })
            .state('cloudifyLayout.logs', {
                url: '/logs' +
                '?pageNoLogs' +
                '&sortByLogs' +
                '&reverseLogs' +
                '&blueprint_idLogs' +
                '&deployment_idLogs' +
                '&levelLogs' +
                '&event_typeLogs' +
                '&timestampLogs' +
                '&messageLogs',
                templateUrl: 'views/logs.html',
                controller: 'LogsCtrl',
                reloadOnSearch: false
            })
            .state('cloudifyLayout.nodes', {
                url: '/nodes',
                templateUrl: 'views/hosts.html',
                controller: 'HostsCtrl'
            })
            .state('cloudifyLayout.interface', {
                url: '/interface',
                templateUrl: 'views/interface.html',
                controller: 'InterfaceCtrl'
            })
            .state('cloudifyLayout.grafana', { url: '/grafana',
                templateUrl: 'views/grafana.html'
            })
            .state('config', { url: '/config',
                templateUrl: 'views/config.html',
                controller: 'ConfigCtrl'
            });
        $urlRouterProvider.otherwise('/blueprints');


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


        //Decorator for date-picker starting with not value at all
        $provide.decorator('mFormatFilter', function ()
        {
            return function newFilter(m, format, tz)
            {
                if (!(moment.isMoment(m))) {
                    return '';
                }
                return tz ? moment.tz(m, tz).format(format) : m.format(format);
            };
        });
    })
    .value('appConfig', {
        versions: {
            ui: '0.0',
            manager: '0.0'
        }
    });

