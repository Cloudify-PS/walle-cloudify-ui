'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiApp.directive:bpActionSelector
 * @description
 * # bpActionSelector
 */
angular.module('cosmoUiApp')
    .directive('bpActionSelector', function (ngDialog, cloudifyClient, $stateParams, $location) {
        return {
            templateUrl: 'views/directives/actionSelector.html',
            restrict: 'C',
            scope: {
                blueprint: '=',
                onDelete: '&',
                isSelected: '='
            },
            controller: function ($scope) {
                var self = this;
                self.openDeployDialog = function(blueprintId) {
                    $scope.selectedBlueprint = null;
                    $scope.blueprintId = blueprintId;
                    ngDialog.open({
                        template: 'views/blueprint/deployBlueprintDialog.html',
                        controller: 'DeployDialogCtrl',
                        scope: $scope,
                        className: 'deploy-dialog'
                    });

                };

                self.openDeleteDialog = function() {
                    ngDialog.open({
                        template: 'views/blueprint/deleteBlueprintDialog.html',
                        controller: 'DeleteBlueprintDialogCtrl',
                        scope: $scope,
                        className: 'delete-dialog'
                    });
                };

                $scope.onCreate = function (deployment) {
                    $location.path('/deployment/' + deployment.id + '/topology');
                    $location.search('');
                };

                $scope.selectAction = function (action) {
                    $scope.currentTask = action.name;
                    $scope.defaultAction = action;
                    action.task();
                };

                $scope.actions = [
                    {
                        name: 'blueprints.actions.deployBtn',
                        task: function () {
                            self.openDeployDialog($scope.blueprint.id);
                        }
                    },
                    {
                        name: 'blueprints.actions.deleteBtn',
                        task: self.openDeleteDialog
                    }
                ];

                $scope.defaultAction = $scope.actions[0];

                if ($stateParams.deploy === 'true') {
                    self.openDeployDialog($scope.blueprint.id);
                }
            },
            link: function postLink(scope, element, attrs, ctrl) {

                scope.$watch('currentExecution', function (executing) {
                    if (executing) {
                        element.addClass('in-progress');
                    } else {
                        element.removeClass('in-progress');
                    }
                }, true);

                scope.$on('hotkeyDeploy', function() {
                    if(scope.isSelected) {
                        ctrl.openDeployDialog(scope.blueprint.id);
                    }
                });

                scope.$on('hotkeyDeleteBlueprint', function() {
                    if(scope.isSelected) {
                        ctrl.openDeleteDialog();
                    }
                });
            }
        };
    });
