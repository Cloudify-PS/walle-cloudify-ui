'use strict';

/**
 * @ngdoc function
 * @name cosmoUiApp.controller:MaintenanceCtrl
 * @description
 * # MaintenanceCtrl
 * Controller of the cosmoUiApp
 */
angular.module('cosmoUiApp')
  .controller('MaintenanceCtrl', function ($scope, MaintenanceService, ngDialog) {
        var maintenanceListener = MaintenanceService.onStatusChange(function(newStatus){
            $scope.status = newStatus;
        });

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
