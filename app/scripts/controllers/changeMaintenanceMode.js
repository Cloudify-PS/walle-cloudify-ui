'use strict';

/**
 * @ngdoc function
 * @name cosmoUiApp.controller:ChangeMaintenanceModeCtrl
 * @description
 * # ChangeMaintenanceModeCtrl
 * Controller of the cosmoUiApp
 */
angular.module('cosmoUiApp')
    .controller('ChangeMaintenanceModeCtrl', function ($scope, MaintenanceService, cloudifyClient) {
        function requestSucceed(httpResponse){
            MaintenanceService.setStatus(httpResponse.data.status);
            $scope.errorMessage = undefined;
            $scope.closeThisDialog();
        }

        function requestFailed(httpResponse){
            $scope.errorMessage = httpResponse.data.message;
        }

        $scope.deactivated = MaintenanceService.getStatus() === 'deactivated';
        $scope.changeMaintenance = function(){
            if($scope.deactivated){
                cloudifyClient.maintenance.activate().then(requestSucceed,requestFailed);
            } else{
                cloudifyClient.maintenance.deactivate().then(requestSucceed,requestFailed);
            }
        };
    });
