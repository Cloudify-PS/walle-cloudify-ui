'use strict';

/**
 * @ngdoc filter
 * @name cosmoUiApp.filter:encodeURI
 * @function
 * @description
 * # encodeURI
 * Filter in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
    .filter('encodeURI', function () {
        return function (uri) {
            return encodeURIComponent(uri);
        };
    });
