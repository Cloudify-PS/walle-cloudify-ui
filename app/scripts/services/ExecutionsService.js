'use strict';

/**
 * @ngdoc service
 * @name cosmoUiApp.ExecutionsService
 * @description
 * # ExecutionsService
 * Service in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
    .service('ExecutionsService', function () {
        // AngularJS will instantiate a singleton by calling "new" on this function

        /**
         *
         * @param {Execution} execution
         * @returns {boolean} true iff execution is currently running
         */
        this.isRunning = function (execution) {
            return !!execution && !!execution.status &&
                ['failed', 'terminated', 'cancelled'].indexOf(execution.status) < 0;
        };

        this.canPause = function (execution) {
            return !!execution;
        };

    });
