'use strict';

angular.module('cosmoUiApp')
    .controller('BlueprintTopologyCtrl', function ($scope, $routeParams, NodeService, blueprintCoordinateService) {
        $scope.blueprintId = $routeParams.blueprintId;

        $scope.$on('toggleChange', function(event, toggleBar){
            $scope.toggleBar = toggleBar;
        });

        $scope.$on('topologyNodeSelected', function(e, data) {
            $scope.viewNode(data, 'node');
        });

        $scope.$on('topologyRelationshipSelected', function(e, data) {
            $scope.viewNode(data, 'relationship');
        });

        $scope.$on('blueprintData', function(event, data){
            $scope.planNodes = data.plan.nodes;
            $scope.nodesTree = NodeService.createNodesTree(data.plan.nodes, true);
            blueprintCoordinateService.resetCoordinates();
            blueprintCoordinateService.setMap(_getNodesConnections(data.plan.nodes));
            $scope.coordinates = blueprintCoordinateService.getCoordinates();
        });

        function _getNodesConnections(nodes) {
            var connections = [];
            nodes.forEach(function (node) {
                var relationships = $scope.getRelationshipByType(node, 'connected_to');
                relationships.forEach(function(connection) {
                    connections.push({
                        source: node.id,
                        target: connection.target_id,
                        type: connection.type,
                        typeHierarchy: connection.type_hierarchy
                    });
                });
            });
            return connections;
        }

        $scope.getRelationshipByType = function(node, type) {
            var relationshipData = [];
            if (node.relationships !== undefined) {
                for (var i = 0; i < node.relationships.length; i++) {
                    if (node.relationships[i].type_hierarchy.join(',').indexOf(type) > -1) {
                        relationshipData.push(node.relationships[i]);
                    }
                }
            }
            return relationshipData;
        };

        $scope.viewNode = function (viewNode, nodeType) {
            viewNode.nodeType = nodeType;
            $scope.viewNodeDetails = viewNode;
        };

    });
