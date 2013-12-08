'use strict';

angular.module('cosmoUi')
    .service('RestService', function RestService($http) {

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
            var callParams = {
                url: '/backend/events',
                method: 'POST',
                data: params
            };
            return _load('events', callParams);
        }

        this.loadBlueprints = _loadBlueprints;
        this.addBlueprint = _addBlueprint;
        this.executeBlueprint = _executeBlueprint;
        this.loadEvents = _loadEvents;
    });
