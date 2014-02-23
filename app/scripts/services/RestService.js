'use strict';

angular.module('cosmoUi')
    .service('RestService', function RestService($http, $timeout, $q, ejsResource) {

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
                //console.log(['loading nodes', params]);
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

        function _Events(server) {

            if(!server) {
                return;
            }

            /*jshint validthis: true */
            var _this = this;
            var ejs = ejsResource(server);
            var oQuery = ejs.QueryStringQuery();
            var client = ejs.Request()
                .from(0)
                .size(100);
            var activeFilters = {};
            var sortField = false;
            var isAutoPull = false;
            var autoPullTimer = '3000';

            function _isActiveFilter(field, term) {
                return activeFilters.hasOwnProperty(field + term);
            }

            function _applyFilters(query) {
                var filter = null;
                var filters = Object.keys(activeFilters).map(function (k) {
                    return activeFilters[k];
                });
                if (filters.length > 1) {
                    filter = ejs.AndFilter(filters);
                }
                else if (filters.length === 1) {
                    filter = filters[0];
                }
                return filter ? ejs.FilteredQuery(query, filter) : query;
            }

            function _autoPull(callbackFn) {
                var deferred = $q.defer();
                isAutoPull = true;
                $timeout(function _internalPull() {
                    if(!isAutoPull) {
                        deferred.resolve('Events Auto Pull Stop!');
                        return;
                    }
                    execute(function(data){
                        if(angular.isFunction(callbackFn)) {
                            callbackFn(data);
                        }
                        deferred.notify(data);
                        $timeout(_internalPull, autoPullTimer);
                    }, false);
                }, autoPullTimer);
                return deferred.promise;
            }

            function filter(field, term) {
                if(_isActiveFilter(field, term)) {
                    delete activeFilters[field + term];
                } else {
                    activeFilters[field + term] = ejs.TermFilter(field, term);
                }
            }

            function sort(field, order) {
                sortField = {};
                sortField[field] = {'order': order};
            }

            function stopAutoPull() {
                isAutoPull = false;
            }

            function execute(callbackFn, autoPull) {
                var results;
                if(sortField) {
                    results = client
                        .query(_applyFilters(oQuery.query('*')))
                        .sort(sortField)
                        .doSearch();
                }
                else {
                    results = client
                        .query(_applyFilters(oQuery.query('*')))
                        .doSearch();
                }
                results.then(function(data){
                    if(data.hasOwnProperty('error')) {
                        console.error(data.error);
                    }
                    else if(angular.isFunction(callbackFn)) {
                        callbackFn(data);
                        if(autoPull === true) {
                            _autoPull(callbackFn);
                        }
                    }
                });
            }

            _this.filter = filter;
            _this.sort = sort;
            _this.stopAutoPull = stopAutoPull;
            _this.execute = execute;
        }

        this.loadBlueprints = _loadBlueprints;
        this.addBlueprint = _addBlueprint;
        this.getBlueprintById = _getBlueprintById;
        this.deployBlueprint = _deployBlueprint;
        this.executeDeployment = _executeDeployment;
        this.getDeploymentById = _getDeploymentById;
        this.getDeploymentNodes = _getDeploymentNodes;
        this.loadEvents = _loadEvents;
        this.loadDeployments = _loadDeployments;
        this.getSettings = _getSettings;
        this.setSettings = _setSettings;
        this.getConfiguration = _getConfiguration;
        this.getEvents = _Events;
    });
