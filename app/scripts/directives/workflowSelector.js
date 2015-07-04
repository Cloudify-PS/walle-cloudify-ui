'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiApp.directive:workflowSelector
 * @description
 * # workflowSelector
 */
angular.module('cosmoUiApp')
    .directive('workflowSelector', function (ngDialog, ExecutionsService) {
        return {
            templateUrl: 'views/directives/workflowSelector.html',
            restrict: 'C',
            scope: {
                deployment: '=',
                currentExecution: '=',
                onSubmit: '=' // fired when form is submitted

            },
            link: function postLink(scope, element) {

                scope.$watch('currentExecution', function (executing) {
                    if (executing) {
                        element.addClass('in-progress');
                    } else {
                        element.removeClass('in-progress');
                    }
                }, true);

                scope.isExecuteEnabled = function () {
                    return scope.model && scope.model.data;
                };

                scope.canCancel = function () {
                    return ExecutionsService.canPause(scope.currentExecution);
                };

                scope.canPlay = function () {
                    return !ExecutionsService.isRunning(scope.currentExecution);
                };

                scope.isRunning = function () {
                    return !ExecutionsService.isRunning(scope.currentExecution);
                };

                scope.isDisabled = function () {
                    return !scope.selectedWorkflow;
                };

                scope.$watch('deployment', function () {
                    if (!scope.deployment) {
                        return;
                    }
                    scope.selectWorkflows = _.map(scope.deployment.workflows, function (w) {
                        return _.merge({value: w.name, label: w.name}, w);
                    });
                });

                function openDialog(confirmationType) {

                    if (confirmationType === 'execute' && scope.model === null) {
                        return;
                    }

                    var isolatedScope = scope.$new(true);
                    isolatedScope.confirmationType = confirmationType;
                    isolatedScope.executedErr = false;
                    isolatedScope.deploymentId = scope.deployment.id;
                    isolatedScope.workflow = scope.selectedWorkflow;

                    isolatedScope.$on('ngDialog.closed', function () { // we want to poll for executions once the dialog is closed
                        try {
                            scope.onSubmit();
                        } catch (e) {
                        }
                    });

                    ngDialog.open({
                        template: 'views/dialogs/executeDialog.html',
                        controller: 'ExecuteDialogCtrl',
                        scope: isolatedScope,
                        className: 'confirm-dialog'
                    });
                }

                scope.onPlay = function () {
                    openDialog('execute');
                };
                scope.onCancel = function () {
                    openDialog('cancel');
                };
            }
        };
    });
