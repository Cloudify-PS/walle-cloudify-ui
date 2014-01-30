'use strict';

angular.module('cosmoUi')
    .directive('settingsToggles', function () {
        return {
            template: '<div class="settings-toggles">' +
                    '<div id="settings-toggles-button" ng-click="toggleOpenList()" ng-class="{bordered: isOpen()}"></div>' +
                    '<div id="settings-toggles-container" ng-show="isOpen()">' +
                        '<div id="settings-toggles-title">Topology settings</div>' +
                        '<ul ng-repeat="toggle in toggles">' +
                            '<li><div class="settings-toggle-switch" toggle-switch text="{{toggle.name}}" value="toggle.state" ng-click="updateToggle(toggle.name)"></div></li>' +
                        '</ul>' +
                    '</div>' +
                '</div>',
            restrict: 'EA',
            scope: {
                'toggles': '='
            },
            link: function (scope) {
                var isOpen = false;

                scope.toggleOpenList = function() {
                    isOpen = !isOpen;
                };

                scope.isOpen = function() {
                    return isOpen;
                };

                scope.updateToggle = function(toggleName) {
                    for (var i in scope.toggles) {
                        var toggle = scope.toggles[i];
                        if (toggle.name === toggleName) {
                            toggle.state = !toggle.state;
                        }
                    }
                };
            }
        };
    });
