'use strict';

angular.module('cosmoUiApp')
    .run(function(cloudifyClient, MaintenanceService, TickerSrv, $state, $rootScope){
        var stateChangeListener = null;
        var maintenanceActions = {
            deactivated: function(){
                stateChangeListener && stateChangeListener();
            },
            activated: function(){
                if(!$state.is('cloudifyLayout.settings.maintenance')){
                    $state.go('cloudifyLayout.settings.maintenance');
                }
                stateChangeListener = $rootScope.$on('$stateChangeStart', function(event) {
                    event.preventDefault();
                });
            }
        };

        MaintenanceService.onStatusChange(function(newStatus){
            maintenanceActions[newStatus] && maintenanceActions[newStatus]();
        });

        function pollMaintenanceStatus(){
            return cloudifyClient.maintenance.get().then(function(httpResponse){
                var data = httpResponse.data;
                data && MaintenanceService.setMaintenanceData(data);
            });
        }

        TickerSrv.register('pollMaintenanceStatus',pollMaintenanceStatus, 10000);
    });
