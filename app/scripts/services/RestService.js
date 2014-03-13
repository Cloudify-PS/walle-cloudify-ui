'use strict';

angular.module('cosmoUi')
    .service('RestService', function RestService($http, $timeout, $q) {

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
                    //console.log(['data loaded',data]);
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
                            if (deployments[i] !== undefined && deployments[i].blueprintId === blueprints[j].id) {
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

        function _getBlueprintSource(params) {
            var callParams = {
                url: '/backend/blueprints/source',
                method: 'POST',
                data: {'blueprintId': params}
            };

            return _load('blueprints/source', callParams);
        }

        function _deployBlueprint(params) {
            var callParams = {
                url: '/backend/deployments/create',
                method: 'POST',
                data: {'blueprintId': params.blueprintId, 'deploymentId': params.deploymentId}
            };

            return _load('deployments/create', callParams);
        }

        function _executeDeployment(params) {
            var callParams = {
                url: '/backend/deployments/execute',
                method: 'POST',
                data: {'deploymentId': params.deploymentId, 'workflowId': params.workflowId}
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
                data: {'deploymentId': params}
            };
            return _load('deployments/executions/get', callParams);
        }

        function _getNode(params) {
            var callParams = {
                url: '/backend/nodes/get',
                method: 'GET',
                params: params
            };
            return _load('nodes/get', callParams);
        }

//        function _loadEvents(params) {
//            var deferred = $q.defer();
//
//            function _internalLoadEvents(){
//                //console.log(['loading events', params]);
//
//                var callParams = {
//                    url: '/backend/events',
//                    method: 'POST',
//                    data: params
//                };
//
//                _load('events', callParams).then(function(data) {
//                    if ( params.from < data.lastEvent){
//                        params.from = data.lastEvent + 1;
//
//                        deferred.notify(data);
//                    }
//
//                    $timeout(_internalLoadEvents, 3000);
//                });
//            }
//
//            _internalLoadEvents();
//
//            return deferred.promise;
//        }

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

        function _getDeploymentNodes(params) {
            var deferred = $q.defer();
            function _internalLoadNodes(){
                var callParams = {
                    url: '/backend/deployments/nodes',
                    method: 'POST',
                    data: params
                };
                _load('nodes', callParams).then(function(data) {
                    deferred.notify(data.nodes);
                    $timeout(_internalLoadNodes, 3000);
                });
            }
            _internalLoadNodes();
            return deferred.promise;
        }

        function _getWorkflows(params) {
            var callParams = {
                url: '/backend/deployments/workflows/get',
                method: 'POST',
                data: {'deploymentId': params.deploymentId}
            };

            return _load('deployments/workflows/get', callParams);
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

        this.loadBlueprints = _loadBlueprints;
        this.addBlueprint = _addBlueprint;
        this.getBlueprintById = _getBlueprintById;
        this.getBlueprintSource = _getBlueprintSource;
        this.deployBlueprint = _deployBlueprint;
        this.getDeploymentExecutions = _getDeploymentExecutions;
        this.executeDeployment = _executeDeployment;
        this.updateExecutionState = _updateExecutionState;
        this.getDeploymentById = _getDeploymentById;
        this.getDeploymentNodes = _getDeploymentNodes;
        this.loadEvents = _loadEvents;
        this.loadDeployments = _loadDeployments;
        this.getWorkflows = _getWorkflows;
        this.getNode = _getNode;
        this.getSettings = _getSettings;
        this.setSettings = _setSettings;
        this.getConfiguration = _getConfiguration;
    });
