'use strict';

angular.module('cosmoUi')
    .filter('yaml', function () {
        return function (input, fallback) {
            if (!!input) {
                return YAML.stringify(input, 999, 4);
            }
            return fallback;
        };
    });
