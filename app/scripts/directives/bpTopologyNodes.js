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
            link: function (scope) {
                scope.myvar = 'hello';
//                scope.getContainerClass = function(node) {
//                    return node;
//                };

                scope.getNodeContainerClass = function(node) {
                    if (node.children !== undefined && node.children.length > 0) {
                        return 'box';
                    }
                    if (node.children === undefined) {
                        return 'app';
                    }
                };
            },
            compile: function(element) {
                return RecursionHelper.compile(element);
            }
        };
    }]);
