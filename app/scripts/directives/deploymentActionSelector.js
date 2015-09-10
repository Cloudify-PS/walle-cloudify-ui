'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiApp.directive:deploymentActionSelector
 * @description
 * # deploymentActionSelector
 */
angular.module('cosmoUiApp')
    .directive('deploymentActionSelector', ['ngDialog', 'cloudifyClient', 'ExecutionsService', function (ngDialog, cloudifyClient, ExecutionsService) {
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

                function openDialog(confirmationType) {

                    if (confirmationType === 'execute' && $scope.model === null) {
                        return;
                    }

                    $scope.confirmationType = confirmationType;
                    $scope.executedErr = false;

                    ngDialog.open({
                        template: 'views/dialogs/executeDialog.html',
                        controller: 'ExecuteDialogCtrl',
                        scope: $scope,
                        className: 'confirm-dialog'
                    });
                }

                function openDeleteDialog() {
                    $scope.itemToDelete = $scope.deployment;
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

                $scope.isExecuteEnabled = function () {
                    return $scope.model && $scope.model.data;
                };

                $scope.canCancel = function () {
                    return ExecutionsService.canPause($scope.currentExecution);
                };

                $scope.isRunning = function () {
                    return !ExecutionsService.isRunning($scope.currentExecution);
                };

                $scope.cancel = function () {
                    console.log($scope.currentExecution);
                    openDialog('cancel');
                };

                $scope.$watch('deployment', function(){
                    if(typeof $scope.deployment !== 'undefined') {
                        $scope.actions = _.map($scope.deployment.workflows, function (w) {
                            return _.merge({
                                value: w.name,
                                label: w.name,
                                task: function () {
                                    $scope.workflow = w;
                                    openDialog('execute');
                                }
                            }, w);
                        });
                        $scope.actions.push({
                            name: 'deployments.deleteBtn',
                            task: openDeleteDialog
                        });
                        $scope.defaultAction = $scope.actions[0];
                    }
                });

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
