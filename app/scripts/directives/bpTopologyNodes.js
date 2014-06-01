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
            link: function postLink(scope) {
                scope.getContainerClass = function(node) {
                    return node;
                };
            },
            compile: function(element) {
                return RecursionHelper.compile(element);
            }
        };
    }]);
