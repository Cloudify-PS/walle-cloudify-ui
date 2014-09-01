    'use strict';

angular.module('cosmoUiApp')
    .controller('DeploymentTopologyCtrl', function ($scope, $routeParams, $log, $location, RestService, NodeService, blueprintCoordinateService) {
        $scope.deploymentId = $routeParams.deploymentId;
        $scope.workflowsList = [];
        $scope.showProperties = null;

        $scope.$on('toggleChange', function(event, toggleBar){
            $scope.toggleBar = toggleBar;
        });

        $scope.$on('topologyNodeSelected', function(e, data) {
            $scope.viewNode(data);
        });

        RestService.getDeploymentById({deployment_id : $scope.deploymentId})
            .then(function(deploymentData) {
                if(deploymentData.hasOwnProperty('error_code')) {
                    $log.error(deploymentData.message);
                    return;
                }

                if(deploymentData.hasOwnProperty('workflows')) {
                    var workflows = [];
                    for (var wi in deploymentData.workflows) {
                        var workflow = deploymentData.workflows[wi];
                        workflows.push({
                            value: workflow.name,
                            label: workflow.name,
                            deployment: deploymentData.id
                        });
                    }
                    $scope.workflowsList = workflows;
                }

                RestService.getBlueprintById({id: deploymentData.blueprint_id})
                    .then(function(data) {
                        $scope.blueprint = data || null;
                        $scope.nodesTree = NodeService.createNodesTree(data.plan.nodes);

                        blueprintCoordinateService.resetCoordinates();
                        blueprintCoordinateService.setMap(_getNodesConnections(data.plan.nodes));
                        $scope.coordinates = blueprintCoordinateService.getCoordinates();
                    });
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


//        function _loadDeployment() {
//            RestService.getDeploymentById({deployment_id : $scope.deploymentId})
//                .then(function(deploymentData) {
//                    if(deploymentData.hasOwnProperty('error_code')) {
//                        $log.error(deploymentData.message);
//                        return;
//                    }
//
//                    if(deploymentData.hasOwnProperty('workflows')) {
//                        var workflows = [];
//                        for (var wi in deploymentData.workflows) {
//                            var workflow = deploymentData.workflows[wi];
//                            workflows.push({
//                                value: workflow.name,
//                                label: workflow.name,
//                                deployment: deploymentData.id
//                            });
//                        }
//                        $scope.workflowsList = workflows;
//                    }
//
//                    _loadExecutions();
//
//                    RestService.getNodeInstances()
//                        .then(function(instances) {
//                            if (instances[0] === '<') {
//                                return;
//                            }
//                            instances.forEach(function(instance) {
//                                if (instance.deployment_id === deploymentData.id) {
//                                    $scope.allNodesArr.push(instance);
//                                }
//                                _setDeploymentModel();
//                            });
//                        });
//
//                    RestService.getNodes({deployment_id: $scope.deploymentId})
//                        .then(function(data) {
//                            var nodes = [];
//                            data.forEach(function(node) {
//                                if (node.deployment_id === deploymentData.id) {
//                                    node.name = node.id;
//                                    nodes.push(node);
//                                }
//                            });
//                            nodesList = nodes;
//
//                            // Set Deployment Model
//                            _setDeploymentModel(nodesList);
//
//                            $scope.nodesTree = NodeService.createNodesTree(nodesList);
//                            $scope.dataTable = nodes;
//
//                            blueprintCoordinateService.resetCoordinates();
//                            blueprintCoordinateService.setMap(_getNodesConnections(nodesList));
//                            $scope.coordinates = blueprintCoordinateService.getCoordinates();
//                            $scope.deployments = deploymentModel;
//
//                            RestService.getProviderContext()
//                                .then(function(providerData) {
//                                    var _extNetworks = [];
//                                    var externalNetwork = {
//                                        'id': providerData.context.resources.ext_network.id,
//                                        'name': providerData.context.resources.ext_network.name,
//                                        'color': getNetworkColor(),
//                                        'type': providerData.context.resources.ext_network.type
//                                    };
//                                    externalNetwork.color = getNetworkColor();
//                                    externalNetwork.devices = [
//                                        {
//                                            'id': providerData.context.resources.router.id,
//                                            'name': providerData.context.resources.router.name,
//                                            'type': providerData.context.resources.router.type,
//                                            'icon': 'router'
//                                        }
//                                    ];
//                                    relations.push({
//                                        source: externalNetwork.id,
//                                        target: externalNetwork.devices[0].id
//                                    });
//                                    _extNetworks.push(externalNetwork);
//
//                                    var subNetwork = providerData.context.resources.subnet;
//                                    subNetwork.color = getNetworkColor();
//                                    relations.push({
//                                        source: subNetwork.id,
//                                        target: externalNetwork.devices[0].id
//                                    });
//                                    _extNetworks.push(subNetwork);
//
//                                    $scope.networks = _createNetworkTree(nodes, _extNetworks);
//
//                                    bpNetworkService.setMap($scope.networks.relations);
//                                    $timeout(function(){
//                                        $scope.networkcoords = bpNetworkService.getCoordinates();
//                                        bpNetworkService.render();
//                                    }, 100);
//                                });
//
//                            blueprintCoordinateService.draw();
//                        });
//
//                    // Execution
//                    RestService.autoPull('getDeploymentExecutions', $scope.deploymentId, RestService.getDeploymentExecutions)
//                        .then(null, null, function (dataExec) {
//                            $log.info('data exec', dataExec);
//                            if (dataExec.length > 0) {
//                                $scope.currentExecution = _getCurrentExecution(dataExec);
//                                $log.info('current execution is', $scope.currentExecution, $scope.deploymentInProgress  );
//                                if ( !$scope.currentExecution && $scope.deploymentInProgress) { // get info for the first time
//                                    $log.info('getting deployment info', isGotExecuteNodes );
//                                    if(!isGotExecuteNodes) {
//                                        RestService.autoPull('getDeploymentNodes', {deployment_id: $scope.deploymentId}, RestService.getDeploymentNodes)
//                                            .then(null, null, function (dataNodes) {
//                                                $scope.nodes = dataNodes.nodes;
//                                            });
//                                    }
//                                    RestService.autoPullStop('getDeploymentNodes');
//                                    $scope.deploymentInProgress = false;
//                                }
//                                else if ($scope.deploymentInProgress === null || $scope.currentExecution !== false) {
//                                    $scope.deploymentInProgress = true;
//                                    RestService.autoPull('getDeploymentNodes', {deployment_id: $scope.deploymentId}, RestService.getDeploymentNodes)
//                                        .then(null, null, function (dataNodes) {
//                                            RestService.getNodeInstances()
//                                                .then(function(data) {
//                                                    dataNodes.forEach(function(node) {
//                                                        data.forEach(function(item) {
//                                                            if (node.node_instances === undefined) {
//                                                                node.node_instances = [];
//                                                            }
//                                                            if (node.node_id === item.node_id) {
//                                                                node.node_instances.push(item);
//                                                            }
//                                                        });
//
//                                                        $scope.nodes = dataNodes;
//                                                        isGotExecuteNodes = true;
//                                                    });
//                                                    $scope.nodes = dataNodes;
//                                                    isGotExecuteNodes = true;
//                                                });
//                                        });
//                                }else{
//                                    RestService.getDeploymentNodes({deployment_id : $scope.deploymentId, state: true}).then(function(dataNodes){
//                                        $log.info('loading information for first time');
//                                        $scope.nodes = dataNodes;
//                                        isGotExecuteNodes = true;
//                                        _updateDeploymentModel(dataNodes);
//                                    });
//                                }
//                            }
//                        });
//
//                    // Stop pull when leave this view
//                    $scope.$on('$destroy', function(){
//                        RestService.autoPullStop('getDeploymentExecutions');
//                        RestService.autoPullStop('getDeploymentNodes');
//                    });
//
//                });
//        }
//
//        function _loadExecutions() {
//            RestService.getDeploymentExecutions($scope.deploymentId)
//                .then(function(data) {
//                    if (data.length > 0) {
//                        for (var i = 0; i < data.length; i++) {
//                            if (data[i].status !== null && data[i].status !== 'failed' && data[i].status !== 'terminated' && data[i].status !== 'cancelled') {
//                                $scope.executedData = data[i];
//                            }
//                        }
//                    }
//                });
//
//            if ($location.path() === '/deployment') {
//                $timeout(function(){
//                    _loadExecutions();
//                }, 60000);
//            }
//        }
//
//        function _setDeploymentModel( data ) {
//            deploymentModel['*'] = angular.copy(deploymentDataModel);
//            for (var nodeId in data) {
//                var node = data[nodeId];
//                if(!deploymentModel.hasOwnProperty(node.id)) {
//                    deploymentModel[node.id] = angular.copy(deploymentDataModel);
//                }
//                deploymentModel['*'].instancesIds.push(node.id);
//                deploymentModel['*'].total += parseInt(node.number_of_instances, 10);
//                deploymentModel[node.id].instancesIds.push(node.id);
//                deploymentModel[node.id].total += parseInt(node.number_of_instances, 10);
//            }
//        }
//
//        _loadDeployment();
    });
