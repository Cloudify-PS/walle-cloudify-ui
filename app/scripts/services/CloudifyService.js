'use strict';

/**
 * @ngdoc service
 * @name cosmoUiAppApp.CloudifyService
 * @description
 * # CloudifyService
 * Service in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
    .service('CloudifyService', function Cloudifyservice($rootScope, $log,  BlueprintsService, VersionService, $http ) {

        function _setSettings(data) {
            return $http({
                url: '/backend/settings',
                method: 'POST',
                data: {settings: {'cosmoServer': data.cosmoServer, 'cosmoPort': data.cosmoPort}}
            });
        }

        function _getSettings() {
            return $http('/backend/settings');
        }

        function _getConfiguration(access) {
            return $http({ url: '/backend/configuration', method: 'GET', params: { access: access || 'all'}});
        }


        // this method translates error code from REST API.
        this.getErrorMessage = function( errResponse ){
            try {
                return '[' + errResponse.data.error_code + '] : ' + errResponse.data.message;
            }catch(e){
                try {
                    return typeof(errResponse.data) === 'string' ? errResponse.data : JSON.stringify(errResponse.data);
                }catch(e){
                    return 'An error has occurred. information is not available';
                }
            }
        };

        this.setSettings = _setSettings;
        this.getSettings = _getSettings;
        this.getConfiguration = _getConfiguration;

        this.blueprints = BlueprintsService;
        this.version = VersionService;

    });
