    'use strict';

angular.module('cosmoUiApp')
    .controller('DeploymentTopologyCtrl', function ($scope, $routeParams, $log, $location, RestService, NodeService, blueprintCoordinateService) {
        var _deploymentModel = {};
        var _nodesList = [];
        var statesIndex = ['uninitialized', 'initializing', 'creating', 'created', 'configuring', 'configured', 'starting', 'started'];

        $scope.deploymentId = $routeParams.deploymentId;
        $scope.workflowsList = [];
        $scope.showProperties = null;

        $scope.$on('toggleChange', function(event, toggleBar){
            $scope.toggleBar = toggleBar;
        });

        $scope.$on('topologyNodeSelected', function(e, data) {
            $scope.viewNode(data);
        });

        $scope.$on('nodesData', function(e, dataNodes, nodesList) {
            _nodesList = nodesList;
        });

        $scope.$on('deploymentExecution', function(e, data) {
            if (data.deploymentInProgress) {
                _updateDeploymentModel(_nodesList);
            }
        });

        $scope.$on('deploymentProcess', function(e, data) {
            _deploymentModel = data;

            _nodesList.forEach(function(node) {
                node.state = _deploymentModel[node.id];
            });

            $scope.nodesTree = NodeService.createNodesTree(_nodesList);

            blueprintCoordinateService.resetCoordinates();
            blueprintCoordinateService.setMap(_getNodesConnections(_nodesList));
            $scope.coordinates = blueprintCoordinateService.getCoordinates();
        });

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

        function _updateDeploymentModel(nodes) {
            var IndexedNodes = {};
            for (var i in nodes) {
                var node = nodes[i];
                IndexedNodes[node.node_id] = {
                    state: node.state
                };
            }
            for (var d in _deploymentModel) {
                var deployment = _deploymentModel[d];
                var _reachable = 0;
                var _states = 0;
                var _completed = 0;

                for (var n in deployment.instancesIds) {
                    var nodeId = deployment.instancesIds[n];
                    var nodeInstance = IndexedNodes[nodeId];
                    if(IndexedNodes.hasOwnProperty(nodeId)) {
                        if(nodeInstance.state === 'started') {
                            _reachable++;
                        }
                        if(statesIndex.indexOf(nodeInstance.state) > 0 || statesIndex.indexOf(nodeInstance.state) < 7) {
                            var stateNum = statesIndex.indexOf(nodeInstance.state);
                            if(stateNum === 7) {
                                _completed++;
                            }
                            _states += stateNum;
                        }
                    }
                }
                deployment.completed = _completed;
                deployment.reachables = _reachable;
                deployment.state = Math.round(_states / deployment.total);
                deployment.states = calcState(_states, deployment.total);

                // Calculate percents for progressbar
                var processDone = 0;
                if(deployment.states < 100) {
                    processDone = deployment.states;
                    deployment.process = {
                        'done': deployment.states
                    };
                }
                else {
                    processDone = calcProgress(deployment.reachables, deployment.total);
                    deployment.process = {
                        'done': processDone
                    };
                }

                // Set Status by Workflow Execution Progress
                if($scope.deploymentInProgress) {
                    setDeploymentStatus(deployment, false);
                }
                else {
                    setDeploymentStatus(deployment, processDone);
                }
            }
        }

        function setDeploymentStatus(deployment, process) {
            if(process === false) {
                deployment.status = 0;
            }
            else if(process === 100) {
                deployment.status = 1;
            }
            else if(process > 0 && process < 100) {
                deployment.status = 2;
            }
            else if(process === 0) {
                deployment.status = 3;
            }
        }

        function calcProgress(partOf, instances) {
            return Math.round(partOf > 0 ? 100 * partOf / instances : 0);
        }

        function calcState(state, instances) {
            return Math.round(state > 0 ? (state / instances / 7 * 100) : 0);
        }
    });
