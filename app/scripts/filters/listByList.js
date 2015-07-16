'use strict';

/**
 * @ngdoc filter
 * @name cosmoUiApp.filter:listByList
 * @function
 * @description
 * # listByList
 * Filter in the cosmoUiApp.
 */

angular.module('cosmoUiApp')
    .filter('listByList', function filterListByList() {
        return function (list, filterList) {
            var results = [];
            for (var f in filterList) {
                var filter = filterList[f];
                for (var l in list) {
                    var item = list[l];
                    if (item.parent === filter.value) {
                        results.push(item);
                    }
                }
            }
            return results;
        };
    });
