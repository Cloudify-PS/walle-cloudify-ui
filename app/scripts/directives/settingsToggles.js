'use strict';

angular.module('cosmoUiApp')
    .directive('settingsToggles', function ($document) {
        return {
            templateUrl: 'views/settingsTogglesTemplate.html',
            restrict: 'EA',
            scope: {
                'toggles': '='
            },
            link: function (scope, element) {
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

                /**
                 * Close on Click Out
                 */
                $document.click(function (e) {
                    if (element.has(e.target).length === 0) {
                        scope.$apply(function(){
                            isOpen = false;
                        });
                    }
                });
            }
        };
    });
