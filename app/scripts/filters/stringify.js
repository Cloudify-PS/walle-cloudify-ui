'use strict';

/**
 * @ngdoc filter
 * @name cosmoUiApp.filter:stringify
 * @function
 * @description
 * # stringify
 * Filter in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
    .filter('stringify', function () {
        return JSON.stringify;
    });
