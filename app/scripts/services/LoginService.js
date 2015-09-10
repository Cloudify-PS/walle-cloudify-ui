'use strict';

/**
 * @ngdoc service
 * @name cosmoUiApp.LoginService
 * @description
 * # LoginService
 * Service in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
    .service('LoginService', function LoginService( $http, $location) {

        this.login = function(data) {
            $http({
                url: '/backend/login',
                method: 'POST',
                data: data
            });
        };

        this.isLoggedIn = function(){
            return $http.get('/backend/isLoggedIn');
        };

        this.logout = function( redirect ){
            return $http.post('/backend/logout').then(function(){
                if ( redirect ) {
                    $location.path('/login');
                }
            }); //todo : handle failure!
        };

    });
