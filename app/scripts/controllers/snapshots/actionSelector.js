'use strict';

/**
 * @ngdoc directive
 * @name cloudifyUiApp.directive:actionSelector
 * @description
 * # actionSelector
 */
angular
    .module('cosmoUiApp')
    .directive('actionSelectorSnapshot', function actionSelector() {
        return {
            templateUrl: 'views/snapshots/actionSelector.html',
            restrict: 'EA',
            scope: {
                target: '=',
                actions: '='
            },
            link: function postLink(scope/*, elem, attrs*/) {
                scope.selectAction = selectAction;

                scope.defaultAction = scope.actions[Object.keys(scope.actions)[0]]; // the first of actions

                scope.$on('hotkeyRestoreSnapshot', function() {
                    if (scope.target === scope.$parent.selection.selected) {
                        selectAction(scope.actions.restore, scope.target);
                    }
                });

                scope.$on('hotkeyDownloadSnapshot', function() {
                    if (scope.target === scope.$parent.selection.selected) {
                        selectAction(scope.actions.download, scope.target);
                    }
                });

                scope.$on('hotkeyDeleteSnapshot', function() {
                    if (scope.target === scope.$parent.selection.selected) {
                        selectAction(scope.actions.delete, scope.target);
                    }
                });

                function selectAction(action, target) {
                    var result = action.task(target);
                    scope.defaultAction = action;
                    // if the task returned a promise
                    if (result && result.then) {
                        scope.inProgress = action.name;
                        result
                            .then(action.success, action.error)
                            .finally(function() { scope.inProgress = null; });
                    }
                }
            }
        };
    });
