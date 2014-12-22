'use strict';

angular.module('cosmoUiApp')
    .service('VersionService', function VersionService($q, $http) {
        var cachedVersion;
        var inProgress = false;
        var defers = [];

        function _getLatest(uiVersion) {
            if (!!cachedVersion) {
                var deferred = $q.defer();

                deferred.resolve(cachedVersion);

                return deferred.promise;

            } else if (!!inProgress) {
                var defer = $q.defer;
                // NO RESOLVE
                defers.push(defer);
                return defer.promise;

            } else {
                inProgress = true;

                var callParams = {
                    url: '/backend/version/latest',
                    method: 'GET',
                    params: {
                        version: uiVersion
                    }
                };

                return $http(callParams).then(function(result) {
                    _.each(defers, function(defer) {
                        defer.resolve(result);
                    });
                    cachedVersion = result;
                    return result;
                });
            }
        }

        function _getUiVersion() {
            return $http.get('/backend/versions/ui');
        }

        function _getManagerVersion() {
            return $http.get('/backend/versions/manager');
        }

        this.getLatest = _getLatest;
        this.getUiVersion = _getUiVersion;
        this.getManagerVersion = _getManagerVersion;
    });
