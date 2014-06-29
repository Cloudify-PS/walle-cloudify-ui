'use strict';

angular.module('cosmoUiApp')
    .controller('ConfigCtrl', function ($scope, $window, RestService) {
        $scope.cosmoServer = '';
        $scope.cosmoPort = '';
        $scope.onlyNumbers = /^\d+$/;
        $scope.errList = [];

        $scope.saveConfiguration = function() {
            var validation = _validateConfiguration();
            if (validation.valid) {
                $scope.errList = [];

                RestService.setSettings({
                    cosmoServer: $scope.cosmoServer,
                    cosmoPort: $scope.cosmoPort
                });

                $window.location = '/';

            } else {
                $scope.errList = validation.messages;
            }
        };

        function _validateConfiguration() {
            var result = {
                valid: true,
                messages: []
            };
            var ipRegEx = new RegExp('^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$');
            var portRegEx = new RegExp('[^0-9]');

            if ($scope.cosmoServer === undefined || $scope.cosmoServer.length === 0 || !ipRegEx.test($scope.cosmoServer)) {
                result.valid = false;
                result.messages.push('Invalid IP address entered');
            }
            if ($scope.cosmoPort === undefined || $scope.cosmoPort.length === 0 || portRegEx.test($scope.cosmoPort)) {
                result.valid = false;
                result.messages.push('Invalid port number entered');
            }

            return result;
        }
    });
