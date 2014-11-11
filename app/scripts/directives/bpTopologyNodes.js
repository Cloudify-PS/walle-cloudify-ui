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

                    scope.onRelationshipSelected = function(relationship) {
                        scope.$emit('topologyRelationshipSelected', relationship);
                    };
                });
            },
            controller: function($scope) {
                $scope.headerHover = null;

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

                $scope.isConnectedTo = function(relationship) {
                    return relationship.type_hierarchy.join(',').indexOf('connected_to') > -1;
                };

                // TODO: 3.2 - Check if function still needed
                $scope.getTypeClass = function(type) {
                    return 'cloudify-nodes-' + type;
                };

                $scope.setHeaderHover = function(nodeName) {
                    $scope.headerHover = nodeName;
                };
            }
        };
    }]);
