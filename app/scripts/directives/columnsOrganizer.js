'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiApp.directive:columnsOrganizer
 * @description
 * # columnsOrganizer
 */
angular.module('cosmoUiApp')
    .directive('columnsOrganizer', function () {
        return {
            templateUrl: 'views/directives/columnsOrganizer.html',
            restrict: 'E',
            replace: true,
            scope: {
                columns: '='
            }
        };
    });
