'use strict';

angular.module('cosmoUi')
    .directive('appStatusWidget', function () {
        return {
            templateUrl: 'views/appStatusWidgetTemplate.html',
            restrict: 'EA'
        };
    });
