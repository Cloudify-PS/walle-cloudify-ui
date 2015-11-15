'use strict';

/**
 * @ngdoc service
 * @name cosmoUiApp.Debounce
 * @description
 * # Debounce
 * Factory in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
  .factory('Debounce', function () {
    return function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate){
                    func.apply(context, args);
                }
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) {
                func.apply(context, args);
            }
        };
    };
});
