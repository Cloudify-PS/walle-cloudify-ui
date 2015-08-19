'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiApp.directive:bpActionSelector
 * @description
 * # bpActionSelector
 */
angular.module('cosmoUiApp')
    .directive('bpActionSelector', ['$translate', function () {
        return {
            templateUrl: 'views/directives/bpActionSelector.html',
            restrict: 'C',
            scope: {
                blueprint: '=',
                openDeployDialog: '&',
                deleteBlueprint: '&'
            },
            controller: function() {

            },
            link: function postLink() {

            }
        };
    }]);
