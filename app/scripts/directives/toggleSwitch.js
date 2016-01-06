'use strict';

angular.module('cosmoUiApp')
    .directive('toggleSwitch', function () {
        return {
            templateUrl: 'views/toggleSwitchTemplate.html',
            restrict: 'EA',
            scope: {
                text: '@',
                value: '='
            },
            replace: true,
            link: function (scope) {

                scope.toggleButton = function () {
                    scope.value = !scope.value;
                };

                scope.isToggleOn = function () {
                    return scope.value;
                };
            }
        };
    });
