'use strict';

/**
 * @ngdoc function
 * @name cosmoUiApp.controller:MaintenanceCtrl
 * @description
 * # MaintenanceCtrl
 * Controller of the cosmoUiApp
 */
angular.module('cosmoUiApp')
  .controller('MaintenanceCtrl', function ($scope, MaintenanceService, ngDialog, cloudifyClient) {
        var maintenanceListener = MaintenanceService.onStatusChange(function(newStatus){
            $scope.status = newStatus;
            if(newStatus === 'activating'){
                $scope.registerTickerTask('maintenance/loadRemainingExecutions', pollRemainingExecutions, 1000);
                $scope.executionsErrorMessage = null;
                $scope.remainingExecutions = null;
                $scope.loadingExecutions = true;
            }else {
                $scope.unregisterTickerTask('maintenance/loadRemainingExecutions');
            }
        });

        function pollRemainingExecutions(){
            var maintenanceData = MaintenanceService.getMaintenanceData();
            if(!maintenanceData || !maintenanceData.remaining_executions || maintenanceData.remaining_executions.length === 0){
                $scope.loadingExecutions = false;
                return {then: function(){}};
            }
            var executionIds = _.pluck(maintenanceData.remaining_executions, 'id');
            return cloudifyClient.executions.list({id: executionIds}).then(function(executionsResponse){
                $scope.remainingExecutions = executionsResponse.data.items;
            }, function(executionsError){
                $scope.executionsErrorMessage = executionsError.message;
            }).finally(function(){
                $scope.loadingExecutions = false;
            });
        }

        $scope.cancelExecution = function(execution){
            ngDialog.open({
                template: 'views/deployment/cancelExecutionDialog.html',
                controller: 'CancelExecutionDialogCtrl',
                scope: _.merge($scope, {currentExecution: execution}),
                className: 'confirm-dialog'
            });
        };


        $scope.$on('$destroy',function(){
            maintenanceListener();
        });

        $scope.openMaintenanceDialog = function(){
            ngDialog.open({
                template: 'views/changeMaintenanceMode.html',
                controller: 'ChangeMaintenanceModeCtrl',
                scope: $scope,
                className: 'change-maintenance-dialog'
            });
        };
    });
