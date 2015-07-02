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

        function calcState(state, instances) {
            return Math.round(state > 0 ? (state / instances / 7 * 100) : 0);
        }

        function calcProgress(partOf, instances) {
            return Math.round(partOf > 0 ? 100 * partOf / instances : 0);
        }


        this.isCompleted = function( instance ){ // sugar
            return this.isStarted(instance);
        };

        this.stateToNum = function( instance ){
            return statesIndex.indexOf(instance.state);
        };

        this.isInProgress = function( instance ){
            var stateNum = this.stateToNum( instance );
            return stateNum > 0 && stateNum <= 7
        };

        this.isUninitialized = function(instance){
            var stateNum = this.stateToNum( instance );
            return stateNum === 0 || stateNum > 7;
        };

        this.isStarted = function( instance ){
            return instance.state === 'started';
        };

        /**
         * translate each of the statesIndex into status and calculates progress both in total and per node
         */
        this.calculateProgress = function (nodeInstances) {

            var me = this;

            function getStats(){
                return {reachable: 0, states: 0, completed: 0, uninitialized: 0};
            }

            var result = { total : getStats() }; // node per stats

            _.each(nodeInstances, function (nodeInstance, isExecuting) {

                if ( !result[nodeInstance.node_id]){
                    result[nodeInstance.node_id] = getStats();
                }
                var nodeStats =  result[nodeInstance.node_id];

                var stateNum = statesIndex.indexOf(nodeInstance.state);
                // Count how many instances are reachable
                if ( me.isStarted(nodeInstance) ) {
                    nodeStats.reachable++;
                    result.total.reachable++;
                }
                // instance state between 'initializing' to 'starting'
                if ( me.isInProgress(nodeInstance)) {
                    nodeStats.states += stateNum;
                    result.total.states += stateNum;

                    // instance 'started'
                    if ( me.isStarted(nodeInstance) ) {
                        nodeStats.completed++;
                        result.total.completed++;
                    }
                }
                // instance 'uninitialized' or 'deleted'
                if ( me.isUninitialized( nodeInstance ) ) {
                    nodeStats.uninitialized++;
                    result.total.uninitialized++;
                }

                // average process
                nodeStats.state = Math.round( nodeStats.states / result.total.states);

                // average process in percentage.. override old value
                nodeStats.states = calcState( nodeStats.states, result.total.states);

                // Set Status by Workflow Execution Progress
                var _processDone = (nodeStats.states < 100 ? nodeStats.states : calcProgress(nodeStats.reachables, nodeStats.total));
                nodeStats.process = {
                    'done': _processDone
                };

                if ( result.total.uninitialized === nodeInstances.length) {
                    nodeStats.status = me.getNodeStatus(nodeStats, isExecuting, false);
                }
                else {
                    nodeStats.status = me.getNodeStatus(nodeStats, isExecuting, _processDone);
                }

            });
        }


    });
