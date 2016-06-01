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
            httpResponse.data && MaintenanceService.setMaintenanceData(httpResponse.data);
            $scope.errorMessage = undefined;
            $scope.closeThisDialog();
        }

        function requestFailed(httpResponse){
            $scope.errorMessage = httpResponse.data.message;
        }

        $scope.deactivated = MaintenanceService.getMaintenanceData().status === 'deactivated';
        $scope.changeMaintenance = function(){
            if($scope.deactivated){
                cloudifyClient.maintenance.activate().then(requestSucceed,requestFailed);
            } else{
                cloudifyClient.maintenance.deactivate().then(requestSucceed,requestFailed);
            }
        };
    });
