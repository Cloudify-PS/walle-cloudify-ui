'use strict';

/**
 * @ngdoc service
 * @name cosmoUiApp.MaintenanceService
 * @description
 * # MaintenanceService
 * Service in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
    .service('MaintenanceService', function () {
        var maintenanceData;
        var callbacks = [];

        this.getMaintenanceData = function(){
            return maintenanceData;
        };

        this.setMaintenanceData = function(newData){
            if((newData && !maintenanceData) || (newData && newData.status !== maintenanceData.status)){
                maintenanceData = newData;
                _.forEach(callbacks,function(callback){
                    callback(maintenanceData.status);
                });
            }else {
                maintenanceData = newData;
            }
        };

        this.onStatusChange = function(callback){
            callbacks.push(callback);
            if(maintenanceData && maintenanceData.status){
                callback(maintenanceData.status);
            }
            return function unregister(){
                callbacks.splice(callbacks.indexOf(callback), 1);
            };
        };
    });
