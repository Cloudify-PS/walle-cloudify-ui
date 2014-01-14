'use strict';

angular.module('cosmoUi')
    .directive('toggleSwitch', function () {
        return {
            template: '<div class="toggle-switch">' +
                    '<div id="toggle-switch-text">{{text}}</div>' +
                    '<div id="toggle-switch-button" class="{{value}}" ng-click="toggleButton()">' +
                        '<div id="toggle-switch-button-text-on" class="toggle-switch-button-text" ng-show="isToggleOn()">ON</div>' +
                        '<div id="toggle-switch-button-circle" class="{{value}}"></div>' +
                        '<div id="toggle-switch-button-text-off" class="toggle-switch-button-text" ng-show="!isToggleOn()">OFF</div>' +
                    '</div>' +
                '</div>',
            restrict: 'EA',
            scope: {
                text: '@',
                value: '@'
            },
            link: function (scope) {

                scope.toggleButton = function() {
                    scope.value = scope.value === 'true' ? 'false' : 'true';
                };

                scope.isToggleOn = function() {
                    return scope.value === 'true';
                };
            }
        };
    });
