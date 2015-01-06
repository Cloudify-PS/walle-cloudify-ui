'use strict';

/**
 * @ngdoc service
 * @name cosmoUiAppApp.BlueprintsService
 * @description
 * # BlueprintsService
 * Service in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
    .service('BlueprintsService', function Blueprintsservice($q, RestLoader) {

        function _load(rest, params){
            return RestLoader.load(rest, params);
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

        function _add(data, successCallback, errorCallback) {
            $.ajax({
                url: '/backend/blueprints/upload',
                data: data,
                type: 'POST',
                contentType: false,
                processData: false,
                cache: false,
                success: function(data) {
                    data = JSON.parse(data);
                    if (data.error_code) {
                        errorCallback({
                            responseText: data
                        });
                    } else {
                        successCallback(data);
                    }
                },
                error: function(e) {
                    errorCallback(e);
                }
            });
        }

        function _getBlueprintById(params) {
            var callParams = {
                url: '/backend/blueprints/get',
                method: 'GET',
                params: params
            };
            return _load('blueprints/get', callParams);
        }

        function _browse(params) {
            var callParams = {
                url: '/backend/blueprints/browse',
                method: 'GET',
                params: params
            };
            return _load('blueprints/browse', callParams);
        }

        function _browseFile(params) {
            var callParams = {
                url: '/backend/blueprints/browse/file',
                method: 'GET',
                params: params
            };
            return _load('blueprints/browse/file', callParams);
        }

        function _deploy(params) {
            var callParams = {
                url: '/backend/deployments/create',
                method: 'POST',
                data: {'blueprint_id': params.blueprint_id, 'deployment_id': params.deployment_id, 'inputs': params.inputs}
            };
            return _load('deployments/create', callParams);
        }

        function _delete(params) {
            var callParams = {
                url: '/backend/blueprints/delete',
                method: 'GET',
                params: params
            };
            return _load('blueprints/delete', callParams);
        }


        this.list = _list;
        this.add = _add;
        this.getBlueprintById = _getBlueprintById;
        this.browse = _browse;
        this.browseFile = _browseFile;
        this.deploy = _deploy;
        this.delete = _delete;

    });
