'use strict';

/**
 * @ngdoc function
 * @name cosmoUiApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the cosmoUiApp
 */
angular.module('cosmoUiApp')
    .controller('LoginCtrl', function ($scope, LoginService) {

        $scope.login = function() {
            if (!$scope.isLoginEnabled()) {
                return;
            }

            var loginData = {
                username: $scope.username,
                password: $scope.password,
                remember: $scope.remember
            };

            LoginService.login(loginData)
                .then(function(result) {
                    console.log(result);
                });
        };

        $scope.isLoginEnabled = function() {
            return $scope.username !== undefined && $scope.password !== undefined;
        };
    });
