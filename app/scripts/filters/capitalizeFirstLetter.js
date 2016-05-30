'use strict';

angular.module('cosmoUiApp')
    .filter('capitalizeFirstLetter', function() {
        return function capitalizeFirstLetter(string) {
            if (string) {
                return string.toString().charAt(0).toUpperCase() + string.slice(1);
            }
        };
    });
