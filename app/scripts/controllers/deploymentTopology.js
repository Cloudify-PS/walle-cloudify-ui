'use strict';

angular.module('cosmoUiApp')
    .controller('DeploymentTopologyCtrl', function ($scope, $routeParams, NodeService, RestService, blueprintCoordinateService) {

        var isGotExecuteNodes = false;

        $scope.deploymentId = $routeParams.deploymentId;


        $scope.$on('selectedWorkflow', function(event, selectedWorkflow) {
            console.log(['selectedWorkflow', selectedWorkflow]);
            $scope.selectedWorkflow = selectedWorkflow;
        });

        $scope.$on('toggleChange', function(event, toggleBar){
            $scope.toggleBar = toggleBar;
        });

        $scope.$on('nodesList', function(event, nodeList){
            $scope.nodesTree = NodeService.createNodesTree(nodeList);
            blueprintCoordinateService.resetCoordinates();
            blueprintCoordinateService.setMap(_getNodesConnections(nodeList));
            $scope.coordinates = blueprintCoordinateService.getCoordinates();
        });

        $scope.$on('deploymentExecution', function(event, deploymentExecution){
            if (!deploymentExecution.currentExecution && deploymentExecution.deploymentInProgress) {
                if(!isGotExecuteNodes) {
                    RestService.autoPull('getDeploymentNodes', {deployment_id: $scope.deploymentId}, RestService.getDeploymentNodes)
                        .then(null, null, function (dataNodes) {
                            $scope.nodes = dataNodes.nodes;
                        });
                }
                RestService.autoPullStop('getDeploymentNodes');
            }
            else if (deploymentExecution.deploymentInProgress === null || deploymentExecution.currentExecution !== false) {
                RestService.autoPull('getDeploymentNodes', {deployment_id: $scope.deploymentId}, RestService.getDeploymentNodes)
                    .then(null, null, function (dataNodes) {
                        RestService.getNodeInstances()
                            .then(function(data) {
                                dataNodes.forEach(function(node) {
                                    data.forEach(function(item) {
                                        if (node.node_instances === undefined) {
                                            node.node_instances = [];
                                        }
                                        if (node.node_id === item.node_id) {
                                            node.node_instances.push(item);
                                        }
                                    });

                                    $scope.nodes = dataNodes;
                                    isGotExecuteNodes = true;
                                });
                                $scope.nodes = dataNodes;
                                isGotExecuteNodes = true;
                            });
                    });
            }
            else {
                isGotExecuteNodes = true;
            }
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
        }

    });
