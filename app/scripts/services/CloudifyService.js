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
                    },
                    function(reason) {
                        deferred.reject(reason);
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


        this.getErrorMessage = function( errResponse ){
            try {
                return '[' + errResponse.data.error_code + '] : ' + errResponse.data.message;
            }catch(e){
                try {
                    return typeof(errResponse.data) === 'string' ? errResponse.data : JSON.stringify(errResponse.data);
                }catch(e){
                    return 'An error has occurred. information is not available';
                }
            }
        };

        this.autoPull = _autoPull;
        this.autoPullStop = _autoPullStop;
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
