'use strict';

/**
 * @ngdoc service
 * @name cosmoUiAppApp.CloudifyService
 * @description
 * # CloudifyService
 * Service in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
    .service('CloudifyService', function Cloudifyservice($rootScope, $q, $log, $timeout, RestLoader, BlueprintsService, DeploymentsService) {

        var autoPull = [],
            autoPullPromise = {};

        function _load(rest, params){
            return RestLoader.load(rest, params);
        }

        function _autoPull(name, params, fn) {
            var deferred = $q.defer();
            if(autoPull.indexOf(name) === -1) {
                autoPull.push(name);
                (function _internalLoad(){
                    fn(params).then(function(data){
                        deferred.notify(data);
                        autoPullPromise[name] = $timeout(_internalLoad, 10000);
                    });
                })();
            }
            return deferred.promise;
        }

        function _autoPullStop(name) {
            if(autoPull.indexOf(name) !== -1) {
                autoPull.splice(autoPull.indexOf(name), 1);
                $timeout.cancel(autoPullPromise[name]);
            }
        }

        $rootScope.$on('$locationChangeStart', function() {
            for(var name in autoPullPromise) {
                _autoPullStop(name);
            }
            $log.info('Stop all pulling workers');
        });

        function _getNode(params) {
            var callParams = {
                url: '/backend/node/get',
                method: 'POST',
                data: params
            };
            return _load('node/get', callParams);
        }

        function _getNodes(params) {
            var callParams = {
                url: '/backend/nodes',
                method: 'POST',
                data: params
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

        function _getVersionsUi() {
            var callParams = {
                url: '/backend/versions/ui',
                method: 'GET'
            };
            return _load('versions/ui', callParams);
        }

        function _getVersionsManager() {
            var callParams = {
                url: '/backend/versions/manager',
                method: 'GET'
            };
            return _load('versions/manager', callParams);
        }

        function _getLatestVersion(version) {
            var callParams = {
                url: '/backend/version/latest',
                method: 'GET',
                params: {
                    version: version
                }
            };
            return _load('version/latest', callParams);
        }

        this.autoPull = _autoPull;
        this.autoPullStop = _autoPullStop;
        this.getNode = _getNode;
        this.getNodes = _getNodes;
        this.getNodeInstances = _getNodeInstances;
        this.getProviderContext = _getProviderContext;
        this.setSettings = _setSettings;
        this.getSettings = _getSettings;
        this.getConfiguration = _getConfiguration;
        this.getVersionsUi = _getVersionsUi;
        this.getVersionsManager = _getVersionsManager;
        this.getLatestVersion = _getLatestVersion;

        this.blueprints = BlueprintsService;
        this.deployments = DeploymentsService;

    });
