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
        var statesIndex = ['uninitialized', 'initializing', 'creating', 'created', 'configuring', 'configured', 'starting', 'started', 'deleted'];

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

        this.getStatesIndex = function() {
            return statesIndex;
        };

        this.getStateByIndex = function(index) {
            return statesIndex[index];
        };

        this.getStatusClass = function(status_id) {
            return statuses[status_id] || '';
        };

        this.getIconClass = function(status_id) {
            return statusIcons[status_id] || '';
        };

        this.getStatuses = function() {
            return statuses;
        };

        this.getNodeStatus = function(deployment, deploymentInProgress, process) {
            if(process === false || process === 0) {
                return 0;
            }
            else if(process === 100) {
                return 1;
            }
            else if(process > 0 && process < 100) {
                // we tried to install
                if (deploymentInProgress) {
                    // execution in progress, set progress status
                    return 0;
                } else if(deployment.completed === 0) {
                    // no execution in progress and none completed - set error status
                    return 3;
                } else {
                    // no execution in progress and some completed - set warning status
                    return 2;
                }

            }
        };

    });
