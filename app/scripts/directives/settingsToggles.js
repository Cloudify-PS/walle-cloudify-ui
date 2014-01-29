'use strict';

angular.module('cosmoUi')
    .directive('settingsToggles', function () {
        return {
            templateUrl: 'views/settingsTogglesTemplate.html',
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
