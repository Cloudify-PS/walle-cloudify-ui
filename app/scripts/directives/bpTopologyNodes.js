'use strict';

angular.module('cosmoUi')
    .directive('bpTopologyNodes', ['RecursionHelper', function (RecursionHelper) {
        return {
            templateUrl: 'views/bpTopologyNodesTemplate.html',
            restrict: 'EA',
            transclude: true,
            scope: {
                map: '=',
                selected: '&'
            },
            compile: function(element) {
                return RecursionHelper.compile(element, function(scope) {
                    scope.$watch('map', function(data) {
                        console.log(data);
                    });
                });
            }
        };
    }]);
