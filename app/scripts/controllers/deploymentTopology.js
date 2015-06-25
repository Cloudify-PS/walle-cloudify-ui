'use strict';

// TODO: there's a lot of copy paste here from BlueprintTopology
angular.module('cosmoUiApp')
    .controller('DeploymentTopologyCtrl', function ($scope, $rootScope, $routeParams, NodeService, blueprintCoordinateService, CloudifyService, $q) {

        var isGotExecuteNodes = false;
        $scope.page = {};

        $scope.deploymentId = $routeParams.deploymentId;

        $scope.$on('selectedWorkflow', function(event, selectedWorkflow) {
            $scope.selectedWorkflow = selectedWorkflow;
        });

        $scope.$on('toggleChange', function(event, toggleBar){
            $scope.toggleBar = toggleBar;
        });

        $scope.$on('topologyNodeSelected', function(e, viewNode) {
            viewNode.nodeType = 'node';
            $scope.page.viewNode = viewNode;
        });

        $scope.$on('topologyRelationshipSelected', function(e, viewNode) {
            viewNode.nodeType = 'relationship';
            $scope.page.viewNode = viewNode;
        });

        $scope.$on('nodesList', function(event, nodeList){
            $scope.nodesList = nodeList;
            $scope.nodesTree = NodeService.createNodesTree(nodeList);
            blueprintCoordinateService.resetCoordinates();
            blueprintCoordinateService.setMap(_getNodesConnections(nodeList));
            $scope.coordinates = blueprintCoordinateService.getCoordinates();
        });

        function _startGetDeploymentNodesAutoPull() {
            var deferred = $q.defer();

            CloudifyService.deployments.getDeploymentNodes({deployment_id: $scope.deploymentId})
                .then(function (dataNodes) {
                    CloudifyService.getNodeInstances()
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
                            deferred.resolve();
                        });
                });

            return deferred.promise;
        }

        $scope.$on('deploymentExecution', function(event, deploymentExecution){
            $scope.deploymentInProgress = deploymentExecution.deploymentInProgress;
            $scope.currentExecution = deploymentExecution.currentExecution;
            if (!deploymentExecution.currentExecution && deploymentExecution.deploymentInProgress) {
                if(!isGotExecuteNodes) {
                    CloudifyService.deployments.getDeploymentNodes({deployment_id: $scope.deploymentId})
                        .then(function (dataNodes) {
                            $scope.nodes = dataNodes.nodes;
                        });
                }
            }
            else if (deploymentExecution.deploymentInProgress === null || deploymentExecution.currentExecution !== false) {
                $scope.registerTickerTask('deploymentTopology/getDeploymentNodes', _startGetDeploymentNodesAutoPull, 10000);
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
