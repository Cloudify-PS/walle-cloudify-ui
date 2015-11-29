'use strict';

/**
 * @ngdoc function
 * @name cosmoUiApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the cosmoUiApp
 */
angular.module('cosmoUiApp')
    .controller('LoginCtrl', function ($scope, LoginService, $log, $location ) {

        $scope.loginPage = {};

        $scope.login = function () {
            $scope.errorMessage = null;
            $log.debug('login...');
            if ($scope.isLoginEnabled()) {
                LoginService.login($scope.loginPage)
                    .then(function success(result) {
                        $log.info('login result', result);
                        $location.path('/');
                    }, function error(/*result*/){
                        $scope.errorMessage = 'invalid credentials'; // todo: translate this
                    });
            }
        };

        $scope.isLoginEnabled = function() {
            return $scope.loginPage.username !== undefined && $scope.loginPage.password !== undefined;
        };
    });
