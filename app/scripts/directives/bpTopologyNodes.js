'use strict';

angular.module('cosmoUi')
    .directive('bpTopologyNodes', function () {
        return {
            templateUrl: 'views/bpTopologyNodesTemplate.html',
            restrict: 'EA',
            transclude: true,
            scope: {
                map: '='
            },
            link: function postLink(scope) {

                scope.getContainerClass = function(node) {
                    return node.type;
                };
            }
        };
    });
