'use strict';

angular.module('cosmoUiApp')
    .directive('bpTopologyNodes',  function (RecursionHelper, TopologyTypes) {
        return {
            templateUrl: 'views/bpTopologyNodesTemplate.html',
            restrict: 'EA',
            transclude: true,
            scope: {
                map: '=',
                deploymentInProgress: '='
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
            controller: function($scope, nodeStatus) {
                $scope.headerHover = null;

                $scope.getBadgeStatusAndIcon = function(status) {
                    return nodeStatus.getStatus(status) + ' ' + nodeStatus.getIcon(status);
                };

                $scope.getBadgeStatus = function(status) {
                    return nodeStatus.getStatus(status);
                };

                $scope.isConnectedTo = function(relationship) {
                    return relationship.type_hierarchy.join(',').indexOf('connected_to') && TopologyTypes.isValidConnection(relationship.node);
                };

                // TODO: 3.2 - Check if function still needed
                $scope.getTypeClass = function(type) {
                    return 'cloudify-nodes-' + type;
                };

                $scope.setHeaderHover = function(nodeName) {
                    $scope.headerHover = nodeName;
                };

                $scope.shouldShowBadge = function(node) {
                    if (node.state === undefined || node.state.completed === undefined) {
                        return false;
                    }

                    if (node.state.status === 0 && !$scope.deploymentInProgress) {
                        return false;
                    }

                    return true;
                };

                $scope.shouldShowBadgeTitle = function(node) {
                    return node.state !== undefined && node.state.completed !== undefined && !node.isContained;
                };
            }
        };
    });
