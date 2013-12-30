'use strict';

angular.module('cosmoUi')
    .directive('toggleSwitch', function () {
        return {
            template: '<div class="toggle-switch">' +
                    '<div id="toggle-switch-text">{{text}}</div>' +
                    '<div id="toggle-switch-button" class="{{value}}" ng-click="toggleButton()">' +
                        '<div id="toggle-switch-button-text-on" class="toggle-switch-button-text">ON</div>' +
                        '<div id="toggle-switch-button-circle" class="{{value}}"></div>' +
                        '<div id="toggle-switch-button-text-off" class="toggle-switch-button-text">OFF</div>' +
                    '</div>' +
                '</div>',
            restrict: 'EA',
            scope: {
               text: '@',
               value: '@'
            },
            link: function (scope, element) {

                scope.toggleButton = function() {
                    scope.value = scope.value === 'on' ? 'off' : 'on';
                };

                scope.$watch('value', function(newVal) {
                    if (newVal === 'off') {
                        _setOff();
                    } else {
                        _setOn();
                    }
                });

                function _setOn() {
                    element.find('#toggle-switch-button-text-off').hide();
                    element.find('#toggle-switch-button-text-on').show();
                }

                function _setOff() {
                    element.find('#toggle-switch-button-text-on').hide();
                    element.find('#toggle-switch-button-text-off').show();
                }
            }
        };
    });
