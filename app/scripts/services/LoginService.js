'use strict';

/**
 * @ngdoc service
 * @name cosmoUiApp.LoginService
 * @description
 * # LoginService
 * Service in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
    .service('LoginService', function LoginService(RestLoader, $http, $location) {

        function _load(rest, params){
            return RestLoader.load(rest, params);
        }

        function _login(data) {
            var callParams = {
                url: '/backend/login',
                method: 'POST',
                data: data
            };
            return _load('login', callParams);
        }

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

        this.login = _login;
    });
