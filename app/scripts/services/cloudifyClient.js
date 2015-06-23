'use strict';

/**
 * @ngdoc service
 * @name cosmoUiApp.cloudifyClient
 * @description
 * # cloudifyClient
 * Factory in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
    .factory('cloudifyClient', function (CloudifyClient, $http, $q, $log ) {
        return new CloudifyClient({'endpoint': '/backend/cloudify-api', request:function( opts, callback ){
                if ( !callback ){
                    callback = function(){}; // noop
                }

                $log.debug('this is request', arguments);
                opts.params = opts.qs;

                return $http(opts).then(function (result) {
                    callback(null, result, result ? result.data : null );
                    return result;
                }, function (result) {
                    callback(null, result);
                    return $q.reject(result);
                });
        }});
    });
