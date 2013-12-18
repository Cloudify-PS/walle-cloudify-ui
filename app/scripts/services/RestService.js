'use strict';

angular.module('cosmoUi')
    .service('RestService', function RestService($http, $timeout, $q, $rootScope) {

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
//        var _currentPlan;

        function _load(rest, params){
            return _restLoader.load(rest, params);
        }

        function _loadBlueprints() {
            return _load('blueprints');
        }

        function _addBlueprint(params) {
            _load('blueprints/add', params);
        }

        function _executeBlueprint(params) {
            var callParams = {
                url: '/backend/blueprints/execution',
                method: 'POST',
                data: {'planId': params, 'workflowId': 'install'}
            };

            return _load('blueprints/execution', callParams);
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

                        deferred.resolve(data);
                    }

                    $timeout(function() {
                        $rootScope.$apply(_internalLoadEvents());
                    }, 3000);
                });
            }

            _internalLoadEvents();

            return deferred.promise;
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
        this.addBlueprint = _addBlueprint;
        this.executeBlueprint = _executeBlueprint;
        this.loadEvents = _loadEvents;
        this.getConfiguration = _getConfiguration;
        this.setConfiguration = _setConfiguration;
    });