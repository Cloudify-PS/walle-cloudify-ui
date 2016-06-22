'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiApp.directive:cancelExecution
 * @description
 * # cancelExecution
 */
angular.module('cosmoUiApp')
    .directive('cancelExecution', function (ngDialog) {
        return {
            template: '<i class="cancel-execution-button fa fa-times-circle" ng-if="[\'started\', \'pending\', \'cancelling\'].indexOf(execution.status) !== -1" ng-click="cancelExecution()"></i>',
            restrict: 'E',
            scope: {
                execution: '='
            },
            link: function postLink(scope) {
                scope.cancelExecution = function(){
                    if(scope.execution){
                        ngDialog.open({
                            template: 'views/deployment/cancelExecutionDialog.html',
                            controller: 'CancelExecutionDialogCtrl',
                            scope: _.merge(scope, {currentExecution: scope.execution}),
                            className: 'confirm-dialog'
                        });
                    }
                };
            }
        };
    });
