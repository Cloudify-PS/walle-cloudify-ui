'use strict';

/**
 * @ngdoc service
 * @name cosmoUiApp.LoginService
 * @description
 * # LoginService
 * Service in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
    .service('LoginService', function LoginService(RestLoader) {

        function _load(rest, params){
            return RestLoader.load(rest, params);
        }

        function _login() {
            var callParams = {
                url: '/backend/login/check',
                method: 'GET'
            };
            return _load('login/check', callParams);
        }

        this.login = _login;
    });
