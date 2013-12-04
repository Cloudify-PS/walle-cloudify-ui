'use strict';

angular.module('cosmoUi')
    .service('RestService', function RestService($http) {

        var _restLoader = new RestLoader();

        function _load(rest, params){
            return _restLoader.load(rest, params);
        }

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

        function _loadBlueprints() {
            return _load('blueprints');
        }

        function _addBlueprint(params) {
            _load('blueprints/add', params);
        }

        this.loadBlueprints = _loadBlueprints;
        this.addBlueprint = _addBlueprint;
    });
