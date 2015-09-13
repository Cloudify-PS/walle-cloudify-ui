'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiApp.directive:workflowSelector
 * @description
 * # workflowSelector
 */
angular.module('cosmoUiApp')
    .directive('workflowSelector', function (ngDialog, ExecutionsService, $filter) {
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

                scope.onPlay = function () {

                    var isolatedScope = scope.$new(true);
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
                        template: 'views/deployment/startExecutionDialog.html',
                        controller: 'StartExecutionDialogCtrl',
                        scope: isolatedScope,
                        className: 'confirm-dialog'
                    });
                };

                scope.getExecutionName = function( currentExecution ) {
                    var translateKey = 'deployment.process.' + currentExecution.workflow_id;
                    var res = $filter('translate')( !!currentExecution.workflow_id ?translateKey : 'deployment.process.wait');
                    if ( res === translateKey ){
                        return currentExecution.workflow_id;
                    }else{
                        return res;
                    }
                };
                scope.onCancel = function () {

                    var isolatedScope = scope.$new(true);
                    isolatedScope.currentExecution = scope.currentExecution;

                    isolatedScope.$on('ngDialog.closed', function () { // we want to poll for executions once the dialog is closed
                        try {
                            scope.onSubmit();
                        } catch (e) {
                        }
                    });

                    ngDialog.open({
                        template: 'views/deployment/cancelExecutionDialog.html',
                        controller: 'CancelExecutionDialogCtrl',
                        scope: isolatedScope,
                        className: 'confirm-dialog'
                    });
                };
            }
        };
    });
