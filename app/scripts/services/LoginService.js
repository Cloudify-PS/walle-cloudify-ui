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

        function _login(data) {
            var callParams = {
                url: '/backend/login',
                method: 'POST',
                data: data
            };
            return _load('login', callParams);
        }

        this.login = _login;
    });
