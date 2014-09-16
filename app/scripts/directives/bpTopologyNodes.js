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
                        scope.$emit('topologyNodeSelected', node);
                    };
                });
            },
            controller: function($scope) {
                $scope.getBadgeStatus = function(status) {
                    switch(status) {
                    case 0:
                        return 'install';
                    case 1:
                        return 'done';
                    case 2:
                        return 'alerts';
                    case 3:
                        return 'failed';
                    default:
                        return 'install';
                    }
                };
            }
        };
    }]);
