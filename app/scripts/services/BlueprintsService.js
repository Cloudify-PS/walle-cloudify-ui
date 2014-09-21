'use strict';

/**
 * @ngdoc service
 * @name cosmoUiAppApp.BlueprintsService
 * @description
 * # BlueprintsService
 * Service in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
    .service('BlueprintsService', function Blueprintsservice($q, $http) {

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

        function _list() {
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


        this.list = _list;

    });
