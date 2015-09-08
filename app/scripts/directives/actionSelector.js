'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiApp.directive:actionSelector
 * @description
 * # actionSelector
 */
angular.module('cosmoUiApp')
    .directive('actionSelector', ['ngDialog', 'cloudifyClient', 'ExecutionsService', function (ngDialog, cloudifyClient, ExecutionsService) {
        return {
            templateUrl: '../../views/directives/actionSelector.html',
            restrict: 'C',
            scope: {
                type: '@',
                blueprint: '=',
                deployment: '=',
                currentExecution: '=',
                loadDeployments: '&'
            },
            controller: function ($scope) {

                var blueprintActions = [
                    {
                        name: 'blueprints.actions.deployBtn',
                        task: function () {
                            openDeployDialog($scope.blueprint.id);
                        }
                    },
                    {
                        name: 'blueprints.actions.deleteBtn',
                        task: function () {
                            deleteBlueprint($scope.blueprint);
                        }
                    }
                ];

                function openDialog(confirmationType) {

                    if (confirmationType === 'execute' && $scope.model === null) {
                        return;
                    }

                    var isolatedScope = $scope.$new(true);
                    isolatedScope.confirmationType = confirmationType;
                    isolatedScope.executedErr = false;
                    isolatedScope.deploymentId = $scope.deployment.id;
                    isolatedScope.workflow = $scope.selectedWorkflow;
                    isolatedScope.currentExecution = $scope.currentExecution;

                    ngDialog.open({
                        template: 'views/dialogs/executeDialog.html',
                        controller: 'ExecuteDialogCtrl',
                        scope: isolatedScope,
                        className: 'confirm-dialog'
                    });
                }

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
                    ngDialog.open({
                        template: 'views/dialogs/delete.html',
                        controller: 'DeleteDialogCtrl',
                        scope: $scope,
                        className: 'delete-dialog'
                    });
                }

                function deleteBlueprint(blueprint) {
                    $scope.itemToDelete = blueprint;
                    openDeleteDialog();
                }

                function deleteDeployment() {
                    $scope.itemToDelete = $scope.deployment;
                    openDeleteDialog();
                }

                $scope.selectAction = function (action) {

                    $scope.currentTask = action.name;
                    $scope.defaultAction = action;
                    action.task();
                };

                $scope.isExecuteEnabled = function () {
                    return $scope.model && $scope.model.data;
                };

                $scope.canCancel = function () {
                    return ExecutionsService.canPause($scope.currentExecution);
                };

                $scope.isRunning = function () {
                    return !ExecutionsService.isRunning($scope.currentExecution);
                };

                $scope.onCancel = function () {
                    openDialog('cancel');
                };


                if ($scope.type === 'blueprint') {
                    $scope.actions = blueprintActions;
                    $scope.defaultAction = $scope.actions[0];
                } else {
                    $scope.$watch('deployment', function(){
                        console.log('hello');
                        $scope.actions = _.map($scope.deployment.workflows, function (w) {
                            return _.merge({value: w.name, label: w.name, task: function(){
                                $scope.selectedWorkflow = w;
                                openDialog('execute');
                            }}, w);
                        });
                        $scope.actions.push({
                            name: 'deployments.deleteBtn',
                            task: deleteDeployment
                        });
                        $scope.defaultAction = $scope.actions[0];
                    });
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
