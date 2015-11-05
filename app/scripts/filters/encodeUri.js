'use strict';

/**
 * @ngdoc filter
 * @name cosmoUiApp.filter:encodeUri
 * @function
 * @description
 * # encodeUri
 * Filter in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
    .filter('encodeUri', function () {
        return encodeURIComponent;
    });
