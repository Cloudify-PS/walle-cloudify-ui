'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiApp.directive:workflowSelector
 * @description
 * # workflowSelector
 */
angular.module('cosmoUiApp')
    .directive('workflowSelector', function ( ngDialog ) {
        return {
            templateUrl: 'views/directives/workflowSelector.html',
            restrict: 'C',
            scope: {
                deployment: '=',
                currentExecution: '='

                },
                link: function postLink(scope) {
                    scope.isExecuteEnabled = function() {
                        return scope.model && scope.model.data;
                    };

                    scope.canCancel = function(){
                        return scope.inProgress && scope.currentExecution != null
                    };

                    scope.canPlay = function(){
                        return !scope.inProgress;
                    };

                    scope.isDisabled = function(){
                        return !scope.selectedWorkflow;
                    };

                    scope.$watch('deployment', function(){
                        if ( !scope.deployment){
                            return;
                        }
                        scope.selectWorkflows = _.map(scope.deployment.workflows, function(w){
                           return _.merge({value: w.name, label: w.name }, w );
                        });
                    });

                    function openDialog(confirmationType) {

                        if ( confirmationType === 'execute' && scope.model === null) {
                            return;
                        }

                        var isolatedScope = scope.$new(true);
                        isolatedScope.confirmationType = confirmationType;
                        isolatedScope.executedErr = false;
                        isolatedScope.deploymentId = scope.deployment.id;
                        isolatedScope.workflow = scope.selectedWorkflow;

                        ngDialog.open({
                            template: 'views/dialogs/confirm.html',
                            controller: 'ExecuteDialogCtrl',
                            scope: isolatedScope,
                            className: 'confirm-dialog'
                        });
                    }

                    scope.onPlay = function(){ openDialog('execute'); };
                    scope.onCancel = function(){ openDialog('cancel');  }
                }
        };
    });
