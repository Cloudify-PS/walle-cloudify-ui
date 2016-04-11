'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiApp.directive:maintenanceMessage
 * @description
 * # maintenanceMessage
 */
angular.module('cosmoUiApp')
    .directive('maintenanceMessage', function (MaintenanceService, $translate) {
        return {
            template: '<div id="maintenance-message" ng-if="maintenanceMsg">{{maintenanceMsg}}</div>',
            restrict: 'E',
            replace: true,
            link: function postLink(scope) {
                function statusChanged(newStatus){
                    $translate('maintenance.message.'+newStatus).then(
                        function(translation){
                            scope.maintenanceMsg = translation;
                        },
                        function(){
                            scope.maintenanceMsg = undefined;
                        }
                    );
                }

                MaintenanceService.onStatusChange(statusChanged);
            }
        };
    });
