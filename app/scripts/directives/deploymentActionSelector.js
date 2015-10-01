'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiApp.directive:deploymentActionSelector
 * @description
 * # deploymentActionSelector
 */
angular.module('cosmoUiApp')
    .directive('deploymentActionSelector', function (ngDialog, cloudifyClient, $filter, ExecutionsService, $log, $interval) {
        return {
            templateUrl: 'views/directives/actionSelector.html',
            restrict: 'C',
            scope: {
                deployment: '=',
                currentExecution: '=',
                onBegin: '&',
                onCancel: '&',
                onDelete: '&'
            },
            controller: function ($scope) {

                $scope.showProgress = true;

                function openCancelExecutionDialog() {
                    ngDialog.open({
                        template: 'views/deployment/cancelExecutionDialog.html',
                        controller: 'CancelExecutionDialogCtrl',
                        scope: $scope,
                        className: 'confirm-dialog'
                    });
                }

                function openStartExecutionDialog(){
                    ngDialog.open({
                        template: 'views/deployment/startExecutionDialog.html',
                        controller: 'StartExecutionDialogCtrl',
                        scope: $scope,
                        className: 'confirm-dialog'
                    });
                }

                function openDeleteDialog() {
                    $scope.itemToDelete = $scope.deployment;
                    ngDialog.open({
                        template: 'views/deployment/deleteDeploymentDialog.html',
                        controller: 'DeleteDeploymentDialogCtrl',
                        scope: $scope,
                        className: 'delete-dialog'
                    });
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

                // comment

                $scope.cancel = function () {
                    $log.debug($scope.currentExecution);
                    openCancelExecutionDialog();
                };

                $scope.getExecutionName = function (currentExecution) {
                    if (!currentExecution) {
                        return null;
                    }
                    var translateKey = 'deployment.process.' + currentExecution.workflow_id;
                    var res = $filter('translate')(!!currentExecution.workflow_id ? translateKey : 'deployment.process.wait');
                    if (res === translateKey) {
                        return currentExecution.workflow_id;
                    } else {
                        return res;
                    }
                };

                $scope.actions = [
                    {
                        name: 'deployments.executeWorkflowBtn',
                        task: openStartExecutionDialog
                    },
                    {
                        name: 'deployments.deleteBtn',
                        task: openDeleteDialog
                    }

                ];
                $scope.defaultAction = $scope.actions[0];

            },
            link: function postLink(scope, element) {

                function deploymentDeletedChecker(deployment_id) {
                    cloudifyClient.deployments.get(deployment_id).then(null, function() {
                        scope.onDelete();
                        $log.log('deployment "' + deployment_id + '" deleted.');
                    });
                }

                scope.$watch('currentExecution', function (executing, oldexecuting) {
                    if (executing) {
                        element.addClass('in-progress');
                    } else {
                        element.removeClass('in-progress');
                        if (oldexecuting && oldexecuting.workflow_id === 'delete_deployment_environment') {
                            deploymentDeletedChecker(oldexecuting.deployment_id);
                        }
                    }
                }, true);
            }
        };
    });
