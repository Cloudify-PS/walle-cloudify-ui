'use strict';

/**
 * @ngdoc filter
 * @name cosmoUiApp.filter:encodeURIComponent
 * @function
 * @description
 * # encodeURIComponent
 * Filter in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
    .filter('encodeURIComponent', function () {
        return window.encodeURIComponent;
    });
