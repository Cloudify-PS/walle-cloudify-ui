'use strict';

/**
 * @ngdoc service
 * @name cosmoUiAppApp.CloudifyService
 * @description
 * # CloudifyService
 * Service in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
    .service('CloudifyService', function Cloudifyservice($rootScope, $q, $log, $timeout, RestLoader, BlueprintsService, DeploymentsService, VersionService) {

        function _load(rest, params){
            return RestLoader.load(rest, params);
        }

        function _getNode(params) {
            var callParams = {
                url: '/backend/nodes/get',
                method: 'POST',
                data: params
            };
            return _load('nodes/get', callParams);
        }

        function _getNodes(params) {
            var callParams = {
                url: '/backend/nodes',
                method: 'GET',
                params: {'deployment_id': params}
            };
            return _load('/backend/nodes', callParams);
        }

        function _getNodeInstances(params) {
            var callParams = {
                url: '/backend/node-instances',
                method: 'GET',
                data: params
            };
            return _load('node-instances', callParams);
        }

        function _getProviderContext() {
            return _load('provider/context');
        }

        function _setSettings(data) {
            var callParams = {
                url: '/backend/settings',
                method: 'POST',
                data: {settings: {'cosmoServer': data.cosmoServer, 'cosmoPort': data.cosmoPort}}
            };
            return _load('settings', callParams);
        }

        function _getSettings() {
            return _load('settings');
        }

        function _getConfiguration(access) {
            var callParams = {
                url: '/backend/configuration',
                method: 'GET',
                params: {
                    access: access || 'all'
                }
            };
            return _load('configuration', callParams);
        }

        //this.autoPull = _autoPull;
        //this.autoPullStop = _autoPullStop;
        this.getNode = _getNode;
        this.getNodes = _getNodes;
        this.getNodeInstances = _getNodeInstances;
        this.getProviderContext = _getProviderContext;
        this.setSettings = _setSettings;
        this.getSettings = _getSettings;
        this.getConfiguration = _getConfiguration;

        this.blueprints = BlueprintsService;
        this.deployments = DeploymentsService;
        this.version = VersionService;

    });
