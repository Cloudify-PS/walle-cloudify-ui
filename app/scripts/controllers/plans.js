'use strict';

angular.module('cosmoUi')
    .controller('PlansCtrl', function ($scope, YamlService, Layout, Render, $routeParams, BreadcrumbsService, PlanDataConvert, blueprintCoordinateService, bpNetworkService, $http, $timeout, $location, RestService) {

        var planData/*:PlanData*/ = null;
        var dataPlan;
        $scope.section = 'topology';
        $scope.propSection = 'general';
        $scope.toggleView = false;
        $scope.nodesTree = [];
        $scope.indexNodes = {};

        $scope.toggleBar = {
            'compute': true,
            'middleware': true,
            'modules': true,
            'connections': true
        };

        $scope.isDeployDialogVisible = false;

        BreadcrumbsService.push('blueprints',
            {
                href: '#/blueprint?id=' + $routeParams.id,
                label: $routeParams.id,
                id: 'blueprint'
            });

        RestService.getBlueprintById({id: $routeParams.id})
            .then(function(data) {
                $scope.blueprint = data || null;
                $scope.nodesTree = _createNodesTree(data.plan.nodes);
                $scope.dataTable = data.plan.nodes;
            });

//        YamlService.load($routeParams.id, function (err, data) {
//
//            planData = data;
//            dataPlan = data.getJSON();
//            var dataMap;
//
//            RestService.getBlueprintById({id: $routeParams.id})
//                .then(function(data) {
//                    $scope.blueprint = data || null;
//                });
//
//            /**
//             * Networks
//             */
//            // Filter data for Networks
//            var networks = PlanDataConvert.nodesToNetworks(dataPlan);
//            $scope.networks = networks;
//            bpNetworkService.setMap(networks.relations);
//
//
//            // Render Networks
//            $timeout(function(){
//                $scope.networkcoords = bpNetworkService.getCoordinates();
//                bpNetworkService.render();
//            }, 100);
//
//            /**
//             * Blueprint
//             */
//            var topology = PlanDataConvert.nodesToTopology(dataPlan);
//
//            // Convert edges to angular format
//            if (topology.hasOwnProperty('edges') && !!topology.edges) {
//                dataMap = PlanDataConvert.edgesToBlueprint(topology.edges);
//            }
//
//            PlanDataConvert.allocateAbandonedNodes(topology, dataMap);
//
//            blueprintCoordinateService.resetCoordinates();
//
//            // Set Map
//            blueprintCoordinateService.setMap(dataMap.connected);
//
//            // Connection between nodes
//            if(dataMap.hasOwnProperty('contained')) {
//                $scope.map = _mergeNodeData(dataMap.contained.reverse());
//            }
//            $scope.coordinates = blueprintCoordinateService.getCoordinates();
//            $scope.dataTable = PlanDataConvert.nodesToTable(dataPlan);
//            RestService.getBlueprintSource($routeParams.id)
//                .then(function(code) {
//                    $scope.dataCode = {
//                        data: code.source
//                    };
//                });
//        });
//
//        function _mergeNodeData(nodesMap) {
//            for (var i = 0; i < nodesMap.length; i++) {
//                dataPlan.nodes.forEach(function (node) {
//                    if (nodesMap[i].id === node.id) {
//                        for (var attr in node) {
//                            nodesMap[i][attr] = node[attr];
//                        }
//                        nodesMap[i].type = nodesMap[i].type[0].split('.').join('-').split('_').join('-');
//
//                        if (nodesMap[i].children !== undefined) {
//                            for (var j = 0; j < nodesMap[i].children.length; j++) {
//                                nodesMap[i].children = _mergeNodeData(nodesMap[i].children);
//                            }
//                        }
//                    }
//                });
//            }
//            return nodesMap;
//        }

        function _createNodesTree(nodes) {
            var roots = [];
            var nodesList = [];

            nodes.forEach(function(node) {
                nodesList[node.id] = node;
            });

            for (var nodeId in nodesList) {
                var node = nodesList[nodeId];
                node.class = _getNodeClass(node.type_hierarchy);

                if (node.relationships !== undefined && !_isNetworkNode(node)) {
                    for (var i = 0; i < node.relationships.length; i++) {
                        node.isApp = _isAppNode(node);
                        if (node.relationships[i].base === 'contained') {
                            node.isContained = true;
                            var target_id = node.relationships[i].target_id;
                            if (nodesList[target_id].children === undefined) {
                                nodesList[target_id].children = [];
                            }
                            nodesList[target_id].children.push(node);
                        }
                        if (i === node.relationships.length - 1 && node.isContained === undefined) {
                            node.isContained = false;
                        }
                    }
                    if (!node.isContained) {
//                        if (node.children === undefined) {
//                            node.class = 'no-children ' + node.class;
//                        }
                        roots.push(node);
                    }
                } else if(!_isNetworkNode(node) && !node.isContained){
                    roots.push(node);
                }
            };

            return roots;
        }

        function _isAppNode(node) {
            var networkNodes = [
                'nodejs_app'
            ];

            return networkNodes.indexOf(node.type) !== -1;
        }

        function _isNetworkNode(node) {
            var networkNodes = [
                'cloudify.openstack.floatingip',
                'cloudify.openstack.network',
                'cloudify.openstack.port',
                'cloudify.openstack.subnet'
            ];

            return networkNodes.indexOf(node.type) !== -1;
        }

        function _getNodeClass(typeHierarchy) {
            for (var i = 0; i < typeHierarchy.length; i++) {
                typeHierarchy[i] = typeHierarchy[i].split('.').join('-').split('_').join('-');
            }
            return typeHierarchy.join(' ');
        }

        $scope.getRelationshipByType = function(node, type) {
            var relationshipData = [];

            if (node.relationships !== undefined) {
                for (var i = 0; i < node.relationships.length; i++) {
                    if (node.relationships[i].type === type) {
                        relationshipData.push(node.relationships[i]);
                    }
                }
            }

            return relationshipData;
        };

        $scope.viewNode = function (node_id) {
            var realNode = planData.getNode(node_id);
            $scope.showProperties = {
                properties: planData.getProperties(realNode),
                relationships: planData.getRelationships(realNode),
                general: planData.getGeneralInfo(realNode)
            };
        };

        $scope.hideProperties = function () {
            $scope.showProperties = null;
        };

        $scope.toggleDeployDialog = function() {
            $scope.isDeployDialogVisible = $scope.isDeployDialogVisible === false;
        };

        $scope.redirectToDeployment = function(deployment_id, blueprint_id) {
            $location.path('/deployment').search({id: deployment_id, blueprintId: blueprint_id});
        };
    });