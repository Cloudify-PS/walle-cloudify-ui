'use strict';

angular.module('cosmoUi')
    .directive('appStatusWidget', function () {
        return {
            template: '<div class="app-status-widget">' +
                    '<div class="title">Apps Status</div>' +
                    '<div class="gauge"></div>' +
                    '<div class="time-left">Time left</div>' +
                '</div>',
            restrict: 'EA'
        };
    });
