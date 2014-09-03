    'use strict';

angular.module('cosmoUiApp')
    .controller('DeploymentTopologyCtrl', function ($scope, $routeParams, NodeService, blueprintCoordinateService) {

        $scope.deploymentId = $routeParams.deploymentId;

        $scope.$on('toggleChange', function(event, toggleBar){
            $scope.toggleBar = toggleBar;
        });

        $scope.$on('nodesData', function(event, nodesData){
            $scope.nodesTree = NodeService.createNodesTree(nodesData);
            blueprintCoordinateService.resetCoordinates();
            blueprintCoordinateService.setMap(_getNodesConnections(nodesData));
            $scope.coordinates = blueprintCoordinateService.getCoordinates();
        });

        $scope.$on('deploymentExecution', function(event, deploymentExecution){
            console.log(['deploymentExecution', deploymentExecution]);
        });

        function _getNodesConnections(nodes) {
            var connections = [];
            nodes.forEach(function (node) {
                var relationships = _getRelationshipByType(node, 'connected_to');
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

        function _getRelationshipByType(node, type) {
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

    });
