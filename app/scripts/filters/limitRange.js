'use strict';

angular.module('cosmoUiApp')
    .filter('limitRange', function () {
        return function (data, from, to) {
            return data.slice(parseFloat(from), parseFloat(to));
        };
    });
