'use strict';

angular.module('cosmoUi')
    .directive('bpTopologyNodes', ['RecursionHelper', function (RecursionHelper) {
        return {
            templateUrl: 'views/bpTopologyNodesTemplate.html',
            restrict: 'EA',
            transclude: true,
            scope: {
                map: '='
            },
//            link: function (scope) {
//
//            },
            compile: function(element) {
                return RecursionHelper.compile(element);
            }
        };
    }]);
