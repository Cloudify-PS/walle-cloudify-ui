'use strict';

/**
 * @ngdoc service
 * @name cosmoUiAppApp.cloudifyLoginInterceptor
 * @description
 * # cloudifyLoginInterceptor
 * Factory in the cosmoUiAppApp.
 */
angular.module('cosmoUiApp')
    .factory('cloudifyLoginInterceptor', function ( $log , $q, user ) {
        return {
            'responseError': function (rejection) {

                $log.info('got bad response', rejection);

                var errorCode = null;
                try{
                    var responseBody = rejection.data;
                    if ( typeof(responseBody) === 'string' ) {
                        responseBody = JSON.parse(responseBody);
                    }
                    errorCode = responseBody.error_code;
                }catch(e){
                    // this is a valid situation no need to print anything
                }

                if (rejection.status === 401 && errorCode === 'unauthorized_error') { // this is a cloudify standard response for authentication.lets redirect to login

                    if(user.loggedIn){
                        $log.info('you\'ve wronged me');
                        rejection.status = 403;
                    }else {
                        $log.info('redirecting to login page');
                        // we cannot use $http or anything here.
                        window.location.hash = '#/login';
                        return;
                    }
                }

                return $q.reject(rejection);
            }
        };
    });
