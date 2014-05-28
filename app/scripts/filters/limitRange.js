'use strict';

angular.module('cosmoUi')
    .filter('limitRange', function () {
        return function (data, from, to) {
            return data.slice(parseFloat(from), parseFloat(to));
        };
    });
