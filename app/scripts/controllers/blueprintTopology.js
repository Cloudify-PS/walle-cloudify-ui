'use strict';

angular.module('cosmoUiApp')
    .controller('BlueprintTopologyCtrl', function ($scope, $routeParams, RestService, NodeService, blueprintCoordinateService) {
        $scope.blueprintId = $routeParams.blueprintId;

        $scope.$on('toggleChange', function(event, toggleBar){
            $scope.toggleBar = toggleBar;
        });

        $scope.$on('topologyNodeSelected', function(e, data) {
            $scope.viewNode(data);
        });

        RestService.getBlueprintById({id: $scope.blueprintId})
            .then(function(data) {
                $scope.blueprint = data || null;
                $scope.nodesTree = NodeService.createNodesTree(data.plan.nodes);
                $scope.dataTable = data.plan.nodes;

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

        $scope.viewNode = function (node) {
            $scope.showProperties = {
                properties: node.properties,
                relationships: node.relationships,
                general: {
                    'name': node.id,
                    'type': node.type
                }
            };
        };

        $scope.hideProperties = function () {
            $scope.showProperties = null;
        };
    });
