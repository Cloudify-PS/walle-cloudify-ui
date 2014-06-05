'use strict';

angular.module('cosmoUi')
    .controller('PlansCtrl', function ($scope, YamlService, Layout, Render, $routeParams, BreadcrumbsService, PlanDataConvert, blueprintCoordinateService, bpNetworkService, $http, $timeout, $location, RestService) {

        var planData/*:PlanData*/ = null;
        var dataPlan;
        $scope.section = 'topology';
        $scope.propSection = 'general';
        $scope.toggleView = false;
        $scope.nodesTree = [];
        $scope.networks = [];
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
                $scope.networks = _createNetworkTree(data.plan.nodes);
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
                node.isApp = _isAppNode(node);

                if (node.relationships !== undefined && !_isNetworkNode(node)) {
                    for (var i = 0; i < node.relationships.length; i++) {
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

                    node.dataType = _getNodeDataType(node);

                    if (!node.isContained) {
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

        function _getNodeDataType(node) {
            if (!node.isContained && node.children !== undefined) {
                return 'compute';
            } else if (node.isContained && !_isAppNode(node)) {
                return 'middleware';
            } else if (node.isContained && _isAppNode(node)) {
                return 'modules';
            }
        }

        function _getNodeClass(typeHierarchy) {
            for (var i = 0; i < typeHierarchy.length; i++) {
                typeHierarchy[i] = typeHierarchy[i].split('.').join('-').split('_').join('-');
            }
            return typeHierarchy.join(' ');
        }

        function _createNetworkTree(nodes) {
            var networkModel = {
                    'external': [
                        {
                            'name': 'External Netowrk',
                            'subnets': [],
                            'devices': []
                        }
                    ],
                    'networks': [],
                    'relations': []
                };

            /* Networks */
            networkModel.networks = _getNetworks(nodes);

            networkModel.networks.forEach(function(network) {
                /* Subnets */
                network.subnets = _getSubnets(network, nodes);

                /* Devices */
                network.devices = _getDevices(nodes, network.subnets);
            });

            return networkModel;
        }

        function _getNetworks(nodes) {
            var networks = [];

            nodes.forEach(function (node) {
                if (node.type.indexOf('network') > -1) {
                    networks.push({
                        'id': node.id,
                        'name': node.name,
                        'subnets': [],
                        'devices': []
                    });
                }
            });

            return networks;
        }

        function _getSubnets(network, nodes) {
            var subnets = [];
            var colors = ['#d54931', '#f89406', '#149bdf', '#555869', '#8eaf26', '#330033', '#4b6c8b', '#550000', '#dc322f', '#FF6600', '#cce80b', '#003300', '#805e00']

            nodes.forEach(function (node) {

                /* Subnets */
                if (node.type.indexOf('subnet') > -1) {
                    var relationships = $scope.getRelationshipByType(node, 'contained');
                    relationships.forEach(function (relationship) {
                        if (network.id === relationship.target_id) {
                            subnets.push({
                                'id': node.id,
                                'name': node.properties.subnet.name ? node.properties.subnet.name : node.name,
                                'cidr': node.properties.subnet.cidr,
                                'color': colors[Math.floor((Math.random() * colors.length) + 1)],
                                'type': 'subnet'
                            });
                        }
                    });
                }
            });

            return subnets;
        }

        function _getDevices(nodes) {
            /* Ports */
            var ports = _getPorts(nodes);
            var devices = [];

            nodes.forEach(function (node) {
                if (node.type.indexOf('host') > -1) {
                    var device = {
                        'id': node.id,
                        'name': node.name,
                        'type': 'device',
                        'icon': 'host',
                        'ports': []
                    };

                    var relationships = $scope.getRelationshipByType(node, 'connected').concat($scope.getRelationshipByType(node, 'depends'));
                    relationships.forEach(function (relationship) {

                        ports.forEach(function(port) {
                            if (relationship.target_id === port.id) {
                                device.ports.push(port);
                            }
                        });

                    });
                    devices.push(device);
                }
            });

            return devices;
        }

        function _getPorts(nodes) {
            var ports = [];

            nodes.forEach(function (node) {
                if (node.type.indexOf('port') > -1) {
                    ports.push({
                        'id': node.id,
                        'name': node.name,
                        'type': 'device',
                        'icon': 'port'
                    });
                }
            });

            return ports;
        }

        $scope.getRelationshipByType = function(node, type) {
            var relationshipData = [];

            if (node.relationships !== undefined) {
                for (var i = 0; i < node.relationships.length; i++) {
                    if (node.relationships[i].base === type) {
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