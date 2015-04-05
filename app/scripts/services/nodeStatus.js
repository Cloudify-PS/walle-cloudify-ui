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
            2: 'install',
            3: 'failed'
        };

        var statusIcons = {
            0: ' icon-gs-node-status-loading',
            1: ' icon-gs-node-status-success',
            2: ' icon-gs-node-status-loading',
            3: ' icon-gs-node-status-fail'
        };

        this.getStatesIndex = function() {
            return statesIndex;
        };

        this.getStateByIndex = function(index) {
            return statesIndex[index];
        };

        this.getStatus = function(status_id) {
            return statuses[status_id] || '';
        };

        this.getIcon = function(status_id) {
            return statusIcons[status_id] || '';
        };

        this.getStatuses = function() {
            return statuses;
        };
    });
