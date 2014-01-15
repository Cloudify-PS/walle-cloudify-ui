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
                    console.log(['data loaded',data]);
                    return data.data;
                });
            }
        }

        var _restLoader = new RestLoader();
        var _blueprints = [];

        function _load(rest, params){
            return _restLoader.load(rest, params);
        }

        function _loadBlueprints() {
            _blueprints = _load('blueprints');
            return _blueprints;
        }

        function _getBlueprints() {
            if (_blueprints.length === 0) {
                _loadBlueprints();
            }
            return _blueprints;
        }

        function _addBlueprint(params) {
            _load('blueprints/add', params);
        }

        function _deployBlueprint(params) {
            var callParams = {
                url: '/backend/deployments/create',
                method: 'POST',
                data: {'blueprintId': params}
            };

            return _load('deployments/create', callParams);
        }

        function _executeDeployment(params) {
            var callParams = {
                url: '/backend/deployments/execute',
                method: 'POST',
                data: {'deploymentId': params, 'workflowId': 'install'}
            };

            return _load('deployments/execute', callParams);
        }

        /**
         *
         * @param params { id: _id, from: _from }
         * @returns {*}
         * @private
         */
        function _loadEvents(params) {
            var deferred = $q.defer();

            function _internalLoadEvents(){
                console.log(['loading events', params]);

                var callParams = {
                    url: '/backend/events',
                    method: 'POST',
                    data: params
                };

                _load('events', callParams).then(function(data) {
                    if ( params.from < data.lastEvent){
                        params.from = data.lastEvent + 1;

                        deferred.notify(data);
                    }

                    $timeout(_internalLoadEvents, 3000);
                });
            }

            _internalLoadEvents();

            return deferred.promise;
        }

        function _loadDeployments() {
            return _load('deployments');
        }

        function _setConfiguration(data) {
            var callParams = {
                url: '/backend/settings',
                method: 'POST',
                data: {settings: {'cosmoServer': data.cosmoServer, 'cosmoPort': data.cosmoPort}}
            };

            return _load('settings', callParams);
        }

        function _getConfiguration() {
            return _load('settings');
        }

        this.loadBlueprints = _loadBlueprints;
        this.getBlueprints = _getBlueprints;
        this.addBlueprint = _addBlueprint;
        this.deployBlueprint = _deployBlueprint;
        this.executeDeployment = _executeDeployment;
        this.loadEvents = _loadEvents;
        this.loadDeployments = _loadDeployments;
        this.getConfiguration = _getConfiguration;
        this.setConfiguration = _setConfiguration;
    });