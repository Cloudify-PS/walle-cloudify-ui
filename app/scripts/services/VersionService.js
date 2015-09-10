'use strict';

/**
 * @function VersionService
 * @description Service handling version requests from the backend. To prevent multiple calls to the backend or the server for the latest version available, the service is caching the first latest version response of the current session
 */

angular.module('cosmoUiApp')
    .service('VersionService', function VersionService($q, $http, cloudifyClient ) {

        var getLatestPromise = null;

        /**
         * Request the latest version available. To prevent multiple calls to the backend, the first latest version response of the current session is cached in teh service
         * @param uiVersion Local UI version number
         * @returns Promise The latest UI version available
         * @private
         */
        this.getLatest = function(uiVersion) {
            if ( getLatestPromise === null ){
                getLatestPromise = $http({
                    url: '/backend/version/latest',
                    method: 'GET',
                    params: {
                        version: uiVersion
                    }
                });
            }
            return getLatestPromise;
        };

        /**
         * Request the local UI version available
         * @returns Promise The local UI version
         * @private
         */
        this.getUiVersion = function() {
            return $http.get('/backend/versions/ui');
        };

        /**
         * Request the current Cloudify manager version
         * @returns Promise The current Cloudify version
         * @private
         */
        this.getManagerVersion = function() {
            return cloudifyClient.manager.get_version();
        };

        /**
         * Returns if the version is the most updated version available
         * @returns Promise The result of the latest version check, returns a boolean value which defines if an update needed
         * @example .then(function(boolean) {})
         * @private
         */
        this.needUpdate = function() {
            var deferred = $q.defer();

            var me = this;
            this.getUiVersion()
                .then(function(data){
                    if(!!data && !!data.data && !!data.data.hasOwnProperty('version')) {
                        var currentVersion = data.data.version;

                        me.getLatest(currentVersion)
                            .then(function(ver) {
                                var _currentVer = parseInt(currentVersion, 10);
                                var _ver = parseInt(ver.data, 10);
                                if (!isNaN(_ver)) {
                                    deferred.resolve(_ver > _currentVer);
                                } else {
                                    deferred.resolve(false);
                                }
                            });
                    }else{
                        deferred.resolve(false);
                    }
                });
            return deferred.promise;
        };

        /**
         * Returns an object with the current ui & manager versions
         * @returns Promise An object with the current ui & manager versions
         * @private
         */
        var versionsPromise = null;
        this.getVersions = function() {
            if ( versionsPromise === null ) {
                versionsPromise = $q.all([
                    this.getUiVersion(),
                    this.getManagerVersion()
                ]).then(function (data) {
                    return {
                        ui: data[0].data.version,
                        manager: data[1].data.version
                    };
                });
            }
            return versionsPromise;
        };

    });
