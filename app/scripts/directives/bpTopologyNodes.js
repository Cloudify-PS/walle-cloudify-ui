'use strict';

angular.module('cosmoUiApp')
    .directive('bpTopologyNodes', ['RecursionHelper', function (RecursionHelper) {
        return {
            templateUrl: 'views/bpTopologyNodesTemplate.html',
            restrict: 'EA',
            transclude: true,
            scope: {
                map: '='
            },
            compile: function(element) {
                return RecursionHelper.compile(element, function(scope) {
                    scope.onNodeSelected = function(node) {
                        scope.$root.$emit('topologyNodeSelected', node);
                    };
                });
            }
        };
    }]);
