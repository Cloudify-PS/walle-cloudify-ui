'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiApp.directive:deploymentActionSelector
 * @description
 * # deploymentActionSelector
 */
angular.module('cosmoUiApp')
    .directive('deploymentActionSelector', function (ngDialog, cloudifyClient, $filter, ExecutionsService, $log) {
        return {
            templateUrl: 'views/directives/actionSelector.html',
            restrict: 'C',
            scope: {
                deployment: '=',
                currentExecution: '=',
                currentUpdate: '=',
                onBegin: '&',
                onCancel: '&',
                onDelete: '&',
                onUpdate: '&',
                isSelected: '='
            },
            controller: function ($scope) {
                var self = this;

                self.openCancelExecutionDialog = function() {
                    if($scope.canCancel() && !$scope.currentUpdate){
                        ngDialog.open({
                            template: 'views/deployment/cancelExecutionDialog.html',
                            controller: 'CancelExecutionDialogCtrl',
                            scope: $scope,
                            className: 'confirm-dialog'
                        });
                    }
                };

                self.openStartExecutionDialog = function() {
                    if(!$scope.isRunning() && !$scope.currentUpdate) {
                        ngDialog.open({
                            template: 'views/deployment/startExecutionDialog.html',
                            controller: 'StartExecutionDialogCtrl',
                            scope: $scope,
                            className: 'confirm-dialog'
                        });
                    }
                };

                self.openDeleteDialog = function() {
                    if(!$scope.isRunning() && !$scope.currentUpdate) {
                        $scope.itemToDelete = $scope.deployment;
                        ngDialog.open({
                            template: 'views/deployment/deleteDeploymentDialog.html',
                            controller: 'DeleteDeploymentDialogCtrl',
                            scope: $scope,
                            className: 'delete-dialog'
                        });
                    }
                };

                self.openUpdateDeploymentDialog = function() {
                    if(!$scope.isRunning() && !$scope.currentUpdate) {
                        ngDialog.open({
                            template: 'views/deployment/updateDeploymentDialog.html',
                            controller: 'UpdateDeploymentDialogCtrl',
                            scope: $scope,
                            className: 'update-deployment-dialog'
                        });
                    }
                };

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
                    return ExecutionsService.isRunning($scope.currentExecution);
                };

                // comment

                $scope.cancel = function () {
                    $log.debug($scope.currentExecution);
                    self.openCancelExecutionDialog();
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
                        task: self.openStartExecutionDialog
                    },
                    {
                        name: 'deployments.updateDeploymentBtn',
                        task: self.openUpdateDeploymentDialog
                    },
                    {
                        name: 'deployments.deleteBtn',
                        task: self.openDeleteDialog
                    }
                ];
                $scope.defaultAction = $scope.actions[0];

            },
            link: function postLink(scope, element, attrs, ctrl) {

                function deploymentDeletedChecker(deployment_id) {
                    cloudifyClient.deployments.get(deployment_id).then(null, function () {
                        scope.onDelete();
                        $log.log('deployment "' + deployment_id + '" deleted.');
                    });
                }

                function handleInProgress(){
                    var className = 'in-progress';
                    if(scope.isRunning() || scope.currentUpdate){
                        if(!element.hasClass(className)){
                            element.addClass(className);
                        }
                    } else{
                        if(element.hasClass(className)) {
                            element.removeClass(className);
                        }
                    }
                }

                scope.$watch('currentExecution', function (executing, oldexecuting) {
                    handleInProgress();
                    if (!executing && oldexecuting && oldexecuting.workflow_id === 'delete_deployment_environment') {
                        deploymentDeletedChecker(oldexecuting.deployment_id);
                    }
                }, true);

                scope.$watch('currentUpdate', function (update, oldUpdate) {
                    handleInProgress();
                    if(oldUpdate && !update){
                        scope.onUpdate();
                    }
                });

                scope.$on('hotkeyExecute', function() {
                    if(scope.isSelected) {
                        ctrl.openStartExecutionDialog();
                    }
                });

                scope.$on('hotkeyDeleteDeployment', function() {
                    if(scope.isSelected) {
                        ctrl.openDeleteDialog();
                    }
                });

                scope.$on('hotkeyCancelExecution', function() {
                    if(scope.isSelected) {
                        ctrl.openCancelExecutionDialog();
                    }
                });

                scope.$on('hotkeyUpdateDeployment', function() {
                    if(scope.isSelected) {
                        ctrl.openUpdateDeploymentDialog();
                    }
                });
            }
        };
    });
