'use strict';

/**
 * @ngdoc service
 * @name cosmoUiAppApp.RestLoader
 * @description
 * # RestLoader
 * Service in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
    .service('RestLoader', function Restloader($http) {

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
            return $http(callParams).then(function (data) {
                return data.data;
            }, function (e) {
                throw e;
            });
        }

    });
