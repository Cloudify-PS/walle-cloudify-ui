'use strict';

/**
 * @ngdoc function
 * @name cosmoUiApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the cosmoUiApp
 */
angular.module('cosmoUiApp')
    .controller('LoginCtrl', function ($scope, LoginService, $log, $location, $http) {	  

        $scope.loginPage = {};

        $scope.login = function () {
            $scope.errorMessage = null;
            $log.debug('login...');
            if ($scope.isLoginEnabled()) {
                LoginService.login($scope.loginPage)
                    .then(function success(result) {
                        $http.defaults.headers.common['x-openstack-authorization'] = result.data['x-openstack-authorization'];					  
                        $http.defaults.headers.common['x-openstack-keystore-url'] = $scope.loginPage.auth_url;
                        $http.defaults.headers.common['x-openstack-keystore-region'] = $scope.loginPage.region;
                        $http.defaults.headers.common['x-openstack-keystore-tenant'] = $scope.loginPage.tenant_name;
                        $log.info('login result', result);
                        $location.path('/');
                    }, function error(/*result*/) {
                        $scope.errorMessage = 'invalid credentials'; // todo: translate this
                    });
            }
        };

        $scope.isLoginEnabled = function () {
            return $scope.loginPage.username !== undefined && $scope.loginPage.password !== undefined;
        };
    });
