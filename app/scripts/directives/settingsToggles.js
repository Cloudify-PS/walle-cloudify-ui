'use strict';

angular.module('cosmoUi')
    .directive('settingsToggles', function () {
        return {
            template: '<div class="settings-toggles">' +
                    '<div id="settings-toggles-button" ng-click="toggleOpenList()" ng-class="{bordered: isOpen()}"></div>' +
                    '<div id="settings-toggles-container" ng-show="isOpen()">' +
                        '<div id="settings-toggles-title">Topology settings</div>' +
                        '<ul ng-repeat="toggle in togglesArr">' +
                            '<li><div class="settings-toggle-switch" toggle-switch text="{{toggle.name}}" value="toggle.state" ng-click="updateToggle(toggle.name, toggle.state)"></div></li>' +
                        '</ul>' +
                    '</div>' +
                '</div>',
            restrict: 'EA',
            scope: {
                'toggles': '='
            },
            link: function (scope) {
                var isOpen = false;
                scope.togglesArr = [];

                scope.$watch('toggles', function() {
                    if (scope.toggles !== undefined) {
                        for (var i in scope.toggles) {
                            scope.togglesArr.push({
                                name: i,
                                state: scope.toggles[i]
                            });
                        }
                    }
                });

                scope.toggleOpenList = function() {
                    isOpen = !isOpen;
                };

                scope.isOpen = function() {
                    return isOpen;
                };

                scope.updateToggle = function(toggleName, toggleState) {
                    for (var i in scope.toggles) {
                        if (i === toggleName) {
                            scope.toggles[i] = toggleState;
                        }
                    }
                };
            }
        };
    });
