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
        var status;
        var callbacks = [];

        this.getStatus = function(){
            return status;
        };

        this.setStatus = function(newStatus){
            if(newStatus && newStatus !== status){
                status = newStatus;
                _.forEach(callbacks,function(callback){
                    callback(status);
                });
            }
        };

        this.onStatusChange = function(callback){
            callbacks.push(callback);
            callback(status);
            return function unregister(){
                callbacks.splice(callbacks.indexOf(callback), 1);
            };
        };
    });
