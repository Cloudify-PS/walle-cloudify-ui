'use strict';

/**
 * @function VersionService
 * @description Service handling version requests from the backend. To prevent multiple calls to the backend or the server for the latest version available, the service is caching the first latest version response of the current session
 */

angular.module('cosmoUiApp')
    .service('VersionService', function VersionService($q, $http, cloudifyClient ) {
        var cachedVersion;
        var inProgress = false;
        var defers = [];

        /**
         * Request the latest version available. To prevent multiple calls to the backend, the first latest version response of the current session is cached in teh service
         * @param uiVersion Local UI version number
         * @returns Promise The latest UI version available
         * @private
         */
        function _getLatest(uiVersion) {
            if (!!cachedVersion) {  // if latest version already cached, return the cached version
                var deferred = $q.defer();

                deferred.resolve(cachedVersion);

                return deferred.promise;

            } else if (!!inProgress) {  // if latest version request is in progress, return the active promise
                var defer = $q.defer();
                // NO RESOLVE
                defers.push(defer);

                return defer.promise;

            } else {    // if there is no cached version and there are no active requests, make a request to backend to load the latest version number
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

        /**
         * Request the local UI version available
         * @returns Promise The local UI version
         * @private
         */
        function _getUiVersion() {
            return $http.get('/backend/versions/ui');
        }

        /**
         * Request the current Cloudify manager version
         * @returns Promise The current Cloudify version
         * @private
         */
        function _getManagerVersion() {
            return cloudifyClient.manager.get_version();
        }

        /**
         * Returns if the version is the most updated version available
         * @returns Promise The result of the latest version check, returns a boolean value which defines if an update needed
         * @example .then(function(boolean) {})
         * @private
         */
        function _needUpdate() {
            var deferred = $q.defer();

            _getUiVersion()
                .then(function(data){
                    if(!!data && data.data.hasOwnProperty('version')) {
                        var currentVersion = data.data.version;

                        _getLatest(currentVersion)
                            .then(function(ver) {
                                var _currentVer = parseInt(currentVersion, 10);
                                var _ver = parseInt(ver.data, 10);
                                if (!isNaN(_ver)) {
                                    deferred.resolve(_ver > _currentVer);
                                } else {
                                    deferred.resolve(false);
                                }
                            });
                    }
                });
            return deferred.promise;
        }

        /**
         * Returns an object with the current ui & manager versions
         * @returns Promise An object with the current ui & manager versions
         * @private
         */
        function _getVersions() {
            var deferred =  $q.defer();
            var versions = {};

            $q.all([
                _getUiVersion(),
                _getManagerVersion()
            ]).then(function(data) {
                versions.ui = data[0].data.version;
                versions.manager = data[1].data.version;

                deferred.resolve(versions);
            });

            return deferred.promise;
        }

        this.getLatest = _getLatest;
        this.getUiVersion = _getUiVersion;
        this.getManagerVersion = _getManagerVersion;
        this.needUpdate = _needUpdate;
        this.getVersions = _getVersions;
    });
