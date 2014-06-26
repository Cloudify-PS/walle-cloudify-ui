'use strict';

angular.module('cosmoUiApp')
    .service('RestService', function RestService($http, $timeout, $q, $rootScope, $log) {

        var autoPull = [],
            autoPullPromise = {};

        function RestLoader() {

            this.load = function (rest, params) {
                return _loadRestInternal(rest, params);
            };

            function _loadRestInternal(rest, params) {
                var callParams = {
                    url: '/backend/' + rest,
                    method: 'GET'
                };
                if (params !== undefined) {
                    callParams = params;
                }
                return $http(callParams).then(function(data) {
                    return data.data;
                }, function(e) {
                    throw e;
                });
            }
        }

        var _restLoader = new RestLoader();

        function _load(rest, params){
            return _restLoader.load(rest, params);
        }

        function _loadBlueprints() {
            var deferred = $q.defer();
            var blueprints = [];
            _load('blueprints').then(function(data) {
                blueprints = data;
                _load('deployments').then(function(data) {
                    var deployments = data;
                    for (var i = 0; i <= deployments.length; i++) {
                        for (var j = 0; j < blueprints.length; j++) {
                            if (blueprints[j].deployments === undefined) {
                                blueprints[j].deployments = [];
                            }
                            if (deployments[i] !== undefined && deployments[i].blueprint_id === blueprints[j].id) {
                                blueprints[j].deployments.push(deployments[i]);
                            }
                        }
                    }
                    deferred.resolve(blueprints);
                });
            }, function(e) {
                deferred.reject(e);
            });

            return deferred.promise;
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

        function _addBlueprint(params) {
            _load('blueprints/add', params);
        }

        function _getBlueprintById(params) {
            var callParams = {
                url: '/backend/blueprints/get',
                method: 'GET',
                params: params
            };
            return _load('blueprints/get', callParams);
        }

        function _browseBlueprint(params) {
            var callParams = {
                url: '/backend/blueprints/browse',
                method: 'GET',
                params: params
            };

            return _load('blueprints/browse', callParams);
        }

        function _browseBlueprintFile(params) {
            var callParams = {
                url: '/backend/blueprints/browse/file',
                method: 'GET',
                params: params
            };

            return _load('blueprints/browse/file', callParams);
        }

        function _deployBlueprint(params) {
            var callParams = {
                url: '/backend/deployments/create',
                method: 'POST',
                data: {'blueprint_id': params.blueprint_id, 'deployment_id': params.deployment_id}
            };

            return _load('deployments/create', callParams);
        }

        function _executeDeployment(params) {
            var callParams = {
                url: '/backend/deployments/execute',
                method: 'POST',
                data: {'deployment_id': params.deployment_id, 'workflow_id': params.workflow_id}
            };

            return _load('deployments/execute', callParams);
        }

        function _updateExecutionState(params) {
            var callParams = {
                url: '/backend/executions/update',
                method: 'POST',
                data: {'executionId': params.executionId, 'state': params.state}
            };

            return _load('executions/update', callParams);
        }

        function _getDeploymentExecutions(params) {
            var callParams = {
                url: '/backend/deployments/executions/get',
                method: 'POST',
                data: {'deployment_id': params}
            };
            return _load('deployments/executions/get', callParams);
        }

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

        function _loadEvents(query) {
            var callParams = {
                url: '/backend/events',
                method: 'POST',
                data: query
            };
            return _load('events', callParams);
        }

        function _loadDeployments() {
            return _load('deployments');
        }

        function _getDeploymentById(params) {
            var callParams = {
                url: '/backend/deployments/get',
                method: 'POST',
                data: params
            };
            return _load('deployments/get', callParams);
        }

        function _deleteDeploymentById(params){
            var callParams = {
                url: '/backend/deployments/delete',
                method: 'POST',
                data: params
            };
            return _load('deployments/delete', callParams);
        }

        function _getDeploymentNodes(params) {
            var callParams = {
                url: '/backend/deployments/nodes',
                method: 'POST',
                data: params
            };
            return _load('nodes', callParams);
        }

        function _getNodeInstances(params) {
            var callParams = {
                url: '/backend/node-instances',
                method: 'GET',
                data: params
            };
            return _load('node-instances', callParams);
        }

        function _getWorkflows(params) {
            var callParams = {
                url: '/backend/deployments/workflows/get',
                method: 'POST',
                data: {'deployment_id': params.deployment_id}
            };

            return _load('deployments/workflows/get', callParams);
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

        function _influxQuery(data) {
            var callParams = {
                url: '/backend/influx',
                method: 'POST',
                data: data
            };

            return _load('influx', callParams);
        }

        function _getMonitorGrpahs() {
            var callParams = {
                url: '/backend/monitor/graphs',
                method: 'GET'
            };
            return _load('monitor/graphs', callParams);
        }

        function _getMonitorCpu() {
            var callParams = {
                url: '/backend/monitor/cpu',
                method: 'GET'
            };
            return _load('monitor/cpu', callParams);
        }

        function _getMonitorMemory() {
            var callParams = {
                url: '/backend/monitor/memory',
                method: 'GET'
            };
            return _load('monitor/memory', callParams);
        }

        this.loadBlueprints = _loadBlueprints;
        this.addBlueprint = _addBlueprint;
        this.getBlueprintById = _getBlueprintById;
        this.browseBlueprint = _browseBlueprint;
        this.browseBlueprintFile = _browseBlueprintFile;
        this.deployBlueprint = _deployBlueprint;
        this.getDeploymentExecutions = _getDeploymentExecutions;
        this.executeDeployment = _executeDeployment;
        this.updateExecutionState = _updateExecutionState;
        this.getDeploymentById = _getDeploymentById;
        this.deleteDeploymentById = _deleteDeploymentById;
        this.getDeploymentNodes = _getDeploymentNodes;
        this.getNodeInstances = _getNodeInstances;
        this.loadEvents = _loadEvents;
        this.loadDeployments = _loadDeployments;
        this.getWorkflows = _getWorkflows;
        this.getProviderContext = _getProviderContext;
        this.getNode = _getNode;
        this.getNodes = _getNodes;
        this.getSettings = _getSettings;
        this.setSettings = _setSettings;
        this.getConfiguration = _getConfiguration;
        this.autoPull = _autoPull;
        this.autoPullStop = _autoPullStop;
        this.influxQuery = _influxQuery;
        this.getMonitorGrpahs = _getMonitorGrpahs;
        this.getMonitorCpu = _getMonitorCpu;
        this.getMonitorMemory = _getMonitorMemory;
    });
