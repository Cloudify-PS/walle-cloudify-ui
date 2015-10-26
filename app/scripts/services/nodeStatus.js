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

        var me = this;
        var statesIndex = ['uninitialized', 'initializing', 'creating', 'created', 'configuring', 'configured', 'starting', 'started', 'deleted'];

        // use this instead of numbers
        var NODE_STATUS = {
            LOADING: 0,
            DONE: 1,
            ALERT: 2,
            FAILED: 3
        };

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

        this.getNodeStatusEnum = function(){
            return NODE_STATUS;
        };

        this.getCompleteProgress = function( instances ){
            var stateNum = this.stateToNum( { state: 'started' } ); // started is the complete
            return stateNum * _.size(instances); // this is our 100%.
        };


        this.isCompleted = function( instance ){ // sugar
            return this.isStarted(instance);
        };

        this.stateToNum = function( instance ){

            return statesIndex.indexOf(instance.state);
        };


        this.getStateWeight = function( instance ){
            return me.isDeleted(instance) ? 0 : Math.max(me.stateToNum(instance),0);
        };


        this.isDeleted = function( instance ){
            return instance.state === 'deleted';
        };

        this.isInProgress = function( instance ){ // todo: consider using !uninitialized.. single source of truth
            var stateNum = me.stateToNum( instance );
            return stateNum > 0 && stateNum <= 7;
        };

        this.isUninitialized = function(instance){
            var stateNum = this.stateToNum( instance );
            return stateNum === 0 || stateNum > 7;
        };


        this.getStatusClass = function(status_id) {
            return statuses[status_id] || '';
        };

        this.getIconClass = function(status_id) {
            return statusIcons[status_id] || '';
        };

        this.getStatus = function (inProgress, instances) {
            var me = this;
            var status = NODE_STATUS.LOADING;

            // if node is not completed when execution is over, the execution is failed. we ignore uninitialized scenario here.
            var failed = _.find(instances, function (instance) {
                return !me.isCompleted(instance);
            });
            var completed = _.find(instances, function (instance) {
                return me.isCompleted(instance);
            });

            var initialized = _.find(instances, function( instance ){
                return !me.isUninitialized(instance);
            });



            if ( initialized ) { // did someone even try to install the blueprint?? - if not, there's nothing to talk about
                if (!inProgress) {
                    if (!completed) { // not even one node is completed. this is a total failure!!!
                        status = NODE_STATUS.FAILED;
                    } else if (failed) { // some are completed. some are failed.. minor failure
                        status = NODE_STATUS.ALERT;
                    }
                } // else in progress, then status is loading. since it is already set.. we do nothing here..

                // no regardless if in progress or not, if everything is ok, show success
                if ( completed && !failed ){ // if all nodes completed and nothing failed, then everything is working. yey!!!!
                    status = NODE_STATUS.DONE;
                }
            }

            return status;
        };

        this.getBadgeStatusAndIcon = function( inProgress, instances ){
            var status = this.getStatus(inProgress, instances);
            return this.getStatusClass( status ) + ' ' + this.getIconClass( status );
        };

        this.getBadgeStatus = function( inProgress, instances ){
            var status = this.getStatus(inProgress, instances);
            return this.getStatusClass( status );
        };


        this.isStarted = function( instance ){
            return instance.state === 'started';
        };

        /**
         * @return {number} the deployment's progress in percentage. (0 - 100)
         */
        this.calculateProgress = function (nodeInstances) {
            var me = this;

            var total = 0;

            _.each(nodeInstances, function(instance){
                total += me.getStateWeight(instance);
            });

            var result = _.size(nodeInstances) > 0 ? ( total / this.getCompleteProgress( nodeInstances ) ) * 100 : 0;

            // normalize so it won't show stupid numbers like -8 or 114..
            result = Math.max(0,result);
            result = Math.min(100,result);

            return result;

        };


    });
