'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiApp.directive:bpActionSelector
 * @description
 * # bpActionSelector
 */
angular.module('cosmoUiApp')
    .directive('bpActionSelector', ['ngDialog', 'cloudifyClient', '$routeParams', function (ngDialog, cloudifyClient, $routeParams) {
        return {
            templateUrl: 'views/directives/actionSelector.html',
            restrict: 'C',
            scope: {
                blueprint: '=',
                onCreate: '&',
                onDelete: '&'
            },
            controller: function ($scope) {

                function openDeployDialog(blueprintId) {
                    $scope.selectedBlueprint = null;
                    ngDialog.open({
                        template: 'views/dialogs/deploy.html',
                        controller: 'DeployDialogCtrl',
                        scope: $scope,
                        className: 'deploy-dialog'
                    });

                    cloudifyClient.blueprints.get(blueprintId, null).then(function (result) {
                        $scope.selectedBlueprint = result.data || null;

                    }); // todo: add error handling
                }

                function openDeleteDialog() {
                    $scope.itemToDelete = $scope.blueprint;
                    ngDialog.open({
                        template: 'views/dialogs/delete.html',
                        controller: 'DeleteDialogCtrl',
                        scope: $scope,
                        className: 'delete-dialog'
                    });
                }

                $scope.selectAction = function (action) {
                    $scope.currentTask = action.name;
                    $scope.defaultAction = action;
                    action.task();
                };

                $scope.actions = [
                    {
                        name: 'blueprints.actions.deployBtn',
                        task: function () {
                            openDeployDialog($scope.blueprint.id);
                        }
                    },
                    {
                        name: 'blueprints.actions.deleteBtn',
                        task: openDeleteDialog
                    }
                ];

                $scope.defaultAction = $scope.actions[0];

                if ($routeParams.deploy === 'true') {
                    openDeployDialog($scope.blueprint.id);
                }
            },
            link: function postLink(scope, element) {

                scope.$watch('currentExecution', function (executing) {
                    if (executing) {
                        element.addClass('in-progress');
                    } else {
                        element.removeClass('in-progress');
                    }
                }, true);

            }
        };
    }]);
