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

        var statusIcons = {
            0: ' icon-gs-node-status-loading',
            1: ' icon-gs-node-status-success',
            2: ' icon-gs-node-status-alert',
            3: ' icon-gs-node-status-fail'
        };

        this.getStatus = function(status_id) {
            return statuses[status_id] || statuses[0];
        };

        this.getIcon = function(status_id) {
            return statusIcons[status_id] || statusIcons[0];
        };

        this.getStatuses = function() {
            return statuses;
        };
    });
