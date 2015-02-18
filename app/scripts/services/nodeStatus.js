'use strict';

/**
 * @ngdoc service
 * @name cosmoUiApp.nodeStatus
 * @description
 * # nodeStatus
 * Service in the cosmoUiAppApp.
 */
angular.module('cosmoUiApp')
    .service('nodeStatus', function () {
        var statuses = {
            0: 'install',
            1: 'done',
            2: 'alerts',
            3: 'failed'
        };

        this.getStatus = function(status_id) {
            return statuses[status_id] || statuses[0];
        };
    });
