'use strict';

angular.module('cosmoUi')
    .controller('PlansCtrl', function ($scope, Layout, Render, $routeParams, BreadcrumbsService, blueprintCoordinateService, bpNetworkService, $http, $timeout, $location, RestService) {

        $scope.section = 'topology';
        $scope.propSection = 'general';
        $scope.toggleView = false;
        $scope.nodesTree = [];
        $scope.dataTable = [];
        $scope.networks = [];
        var relations = [];
        var colors = ['#d54931', '#f89406', '#149bdf', '#555869', '#8eaf26', '#330033', '#4b6c8b', '#550000', '#dc322f', '#FF6600', '#cce80b', '#003300', '#805e00'];

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

                blueprintCoordinateService.resetCoordinates();
                blueprintCoordinateService.setMap(_getNodesConnections(data.plan.nodes));
                $scope.coordinates = blueprintCoordinateService.getCoordinates();

                RestService.getProviderContext()
                    .then(function(providerData) {
                        var _extNetworks = [];
                        _extNetworks.push(providerData.context.resources.subnet);
                        _extNetworks[0].color = colors[Math.floor((Math.random() * colors.length) + 1)];
                        $scope.networks = _createNetworkTree(data.plan.nodes, _extNetworks);

                        bpNetworkService.setMap($scope.networks.relations);
                        $timeout(function(){
                            $scope.networkcoords = bpNetworkService.getCoordinates();
                            bpNetworkService.render();
                        }, 100);
                    });
            });

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
                        if (node.relationships[i].type_hierarchy.join(',').indexOf('contained_in') > -1) {
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
            }

            return roots.reverse();
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
                'cloudify.openstack.subnet',
                'subnet'
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

        function _createNetworkTree(nodes, externalNetworks) {
            var networkModel = {
                    'external': externalNetworks || [],
                    'networks': [],
                    'relations': []
                };

            /* Networks */
            networkModel.networks = _getNetworks(nodes);

            networkModel.networks.forEach(function(network) {
                /* Subnets */
                network.subnets = _getSubnets(network, nodes);

                /* Devices */
                network.devices = _getDevices(nodes, networkModel.external);
            });

            networkModel.relations = relations;

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
                            relations.push({
                                source: node.id,
                                target: network.id,
                                type: relationship.type,
                                typeHierarchy: relationship.type_hierarchy
                            });
                        }
                    });
                }
            });

            return subnets;
        }

        function _getDevices(nodes, externalNetworks) {
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

                    var relationships = $scope.getRelationshipByType(node, 'connected_to').concat($scope.getRelationshipByType(node, 'depends_on'));
                    relationships.forEach(function (relationship) {
                        ports.forEach(function(port) {
                            if (relationship.target_id === port.id) {
                                device.ports.push(port);

                                relations.push({
                                    source: port.subnet,
                                    target: port.id
                                });
                            }
                        });
                    });

                    externalNetworks.forEach(function (extNetwork) {
                        relations.push({
                            source: extNetwork.id,
                            target: node.id
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
                    var relationships = $scope.getRelationshipByType(node, 'depends_on');
                    ports.push({
                        'id': node.id,
                        'name': node.name,
                        'type': 'device',
                        'icon': 'port',
                        'subnet': relationships[0].target_id
                    });
                }
            });

            return ports;
        }

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

        $scope.$root.$on('topologyNodeSelected', function(e, data) {
            $scope.viewNode(data);
        });

        RestService.browseBlueprint({id: $routeParams.id})
            .then(function(browseData) {
                $scope.browseData = [browseData];
            });

        $scope.setBrowseType = function(data) {
            if(data.hasOwnProperty('children')) {
                return 'folder';
            }
            return 'file-' + data.encoding;
        };

        $scope.openSourceFile = function(data) {
            RestService.browseBlueprintFile({id: $routeParams.id, path: data.relativePath})
                .then(function(fileContent) {
                    $scope.dataCode = {
                        data: fileContent,
                        brush: getBrashByFile(data.name)
                    };
                });
        };

        function getBrashByFile(file) {
            var ext = file.split('.');
            switch(ext[ext.length-1]) {
            case 'sh':
                return 'bash';
            case 'bat':
                return 'bat';
            case 'cmd':
                return 'cmd';
            case 'ps1':
                return 'powershell';
            case 'yaml':
                return 'yml';
            case 'py':
                return 'py';
            case 'md':
                return 'text';
            default:
                return 'text';
            }
        }

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

        $scope.getNodeById = function(node_id) {
            var _node = {};
            $scope.dataTable.forEach(function(node) {
                if (node.id === node_id) {
                    _node = node;
                }
            });
            return _node;
        };

        $scope.toggleDeployDialog = function() {
            $scope.isDeployDialogVisible = $scope.isDeployDialogVisible === false;
        };

        $scope.redirectToDeployment = function(deployment_id, blueprint_id) {
            $location.path('/deployment').search({id: deployment_id, blueprint_id: blueprint_id});
        };

    });
