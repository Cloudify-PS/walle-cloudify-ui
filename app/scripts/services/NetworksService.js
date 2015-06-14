'use strict';

/**
 * @ngdoc service
 * @name cosmoUiAppApp.NetworksService
 * @description
 * # NetworksService
 * Service in the cosmoUiAppApp.
 */
angular.module('cosmoUiApp')
    .service('NetworksService', function Networksservice() {

        var networkModel = {
            external: {},
            networks: [],
            relations: []
        };

        var _colors = {
            idx: 0,
            colors:['#1F77B4', '#FF7F0E', '#2CA02C', '#D62728', '#9467BD', '#8C564B', '#4b6c8b', '#550000', '#dc322f', '#FF6600', '#cce80b', '#003300', '#805e00']
        };

        var _relationshipTypes = {
            CONNECTED_TO: 'connected_to',
            CONNECTED: 'connected',
            CONTAINED: 'contained',
            DEPENDS_ON: 'depends_on'
        };

        var _nodeTypes = {
            NETWORK: 'network',
            SUBNET: 'subnet',
            ROUTER: 'router',
            PORT: 'port'
        };

        function _createNetworkTree(providerData, nodes) {
            _resetNetworkModel();
            _resetNetworkColors();

            _setExternalNetworks(providerData, nodes);
            _setNetworkTree(nodes);

            return networkModel;
        }

        function _resetNetworkModel() {
            networkModel = {
                external: {},
                networks: [],
                relations: []
            };
        }

        function _setExternalNetworks(providerData, nodes) {
            var extNetwork = providerData.context.resources.ext_network;
            var intNetwork = providerData.context.resources.int_network;
            var intSubnet = providerData.context.resources.subnet;
            providerData.context.resources.router.icon = 'router';

            /* public network */
            networkModel.external = {
                'id': extNetwork.id,
                'name': extNetwork.name,
                'color': _getNetworkColor(),
                'type': extNetwork.type,
                'routers': [
                    providerData.context.resources.router
                ],
                'subnets': []
            };

            networkModel.relations.push({
                source: networkModel.external.id,
                target: providerData.context.resources.router.id
            });

            var externalSubnet = {
                'id': intNetwork.id,
                'name': intNetwork.name,
                'type': intNetwork.type,
                'color': _getNetworkColor(),
                'subnet': {
                    'id': intNetwork.id,    // The router is connecting by network id and not subnet id, so subnet must have the network id
                    'name': intSubnet.name,
                    'type': intSubnet.type,
                    'routers': _getRouters(nodes)
                }
            };
            networkModel.relations.push({
                source: externalSubnet.id,
                target: providerData.context.resources.router.id
            });
            networkModel.external.subnets.push(externalSubnet);
        }

        function _setNetworkTree(nodes) {
            /* Networks */
            networkModel.networks = _getNetworks(nodes);
            networkModel.networks.forEach(function (network) {
                network.subnets = _getSubnets(network, nodes);
                network.devices = _getDevices(nodes, network);
            });
        }

        function _getNetworks(nodes) {
            var networks = [];

            nodes.forEach(function (node) {
                if (node.type.toLowerCase().indexOf(_nodeTypes.NETWORK) > -1) {
                    networks.push({
                        'id': node.id,
                        'name': node.id,
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
                if (node.type.toLowerCase().indexOf(_nodeTypes.SUBNET) > -1) {
                    var relationships = _getRelationshipByType(node, _relationshipTypes.CONTAINED);
                    relationships = relationships.concat(_getRelationshipByType(node, _relationshipTypes.CONNECTED));
                    relationships.forEach(function (relationship) {
                        if (network.id === relationship.target_id) {
                            subnets.push({
                                'id': node.id,
                                'name': node.properties.subnet.name ? node.properties.subnet.name : node.name,
                                'cidr': node.properties.subnet.cidr,
                                'color': _getNetworkColor(),
                                'type': 'subnet',
                                'state': {
                                    'total': node.number_of_instances,
                                    'completed': 0
                                }
                            });
                        }
                        _addRelation({
                            source: node.id,
                            target: relationship.target_id,
                            type: relationship.type,
                            typeHierarchy: relationship.type_hierarchy
                        });
                    });
                }
            });

            return subnets;
        }

        function _getDevices(nodes, network) {
            var devices = [];

            nodes.forEach(function (node) {
                if (isDevice(node)) {
                    var device = {
                        'id': node.id,
                        'name': node.name,
                        'type': node.type.substr(node.type.lastIndexOf('.') + 1).toLowerCase(),
                        'icon': node.type_hierarchy.join(' ').replace(/\./g, '-'),
                        'state': {
                            'total': node.number_of_instances,
                            'completed': 0
                        }
                    };

                    var relationships = _getRelationshipByType(node, _relationshipTypes.CONNECTED_TO);
                    relationships.forEach(function (relationship) {
                        if (relationship.target_id === network.id) {
                            devices.push(device);

                            _addRelation({
                                source: _getSubnetByNetwork(relationship.target_id).id,
                                target: device.id
                            });
                        }
                    });
                }
            });

            return devices;
        }

        function _getRouters(nodes) {
            var ports = _getPorts(nodes);

            nodes.forEach(function (node) {
                if (isDevice(node)) {
                    var router = {
                        'id': node.id,
                        'name': node.name,
                        'type': node.type.substr(node.type.lastIndexOf('.') + 1).toLowerCase(),
                        'icon': 'device',
                        'state': {
                            'total': node.number_of_instances,
                            'completed': 0
                        },
                        'ports': []
                    };
                    var relationships = _getRelationshipByType(node, _relationshipTypes.CONNECTED_TO);
                    relationships.forEach(function (relationship) {
                        if (ports.length > 0) {
                            ports.forEach(function (port) {
                                if (relationship.target_id === port.id) {
                                    var _alreadyExists = false;
                                    router.ports.forEach(function (item) {
                                        if (item.id === port.id) {
                                            _alreadyExists = true;
                                        }
                                    });
                                    if (!_alreadyExists) {
                                        router.ports.push(port);
                                        _addRelation({
                                            source: port.subnet,
                                            target: port.id
                                        });
                                    }
                                }
                            });
                        }
                    });

                    if (router.type === _nodeTypes.ROUTER) {
                        networkModel.external.routers.push({
                            'id': router.id,
                            'name': router.name,
                            'type': router.type,
                            'icon': 'router'
                        });
                        _addRelation({
                            source: networkModel.external.id,
                            target: router.id
                        });
                    }
                }
            });
        }

        function _getPorts(nodes) {
            var ports = [];

            nodes.forEach(function (node) {
                if (node.type.indexOf(_nodeTypes.PORT) > -1) {
                    var relationships = _getRelationshipByType(node, _relationshipTypes.DEPENDS_ON);
                    relationships.forEach(function (relationship) {
                        if (relationship.type.toLowerCase().indexOf(_relationshipTypes.DEPENDS_ON) > -1) {
                            ports.push({
                                'id': node.id,
                                'name': node.name,
                                'type': 'device',
                                'icon': 'port',
                                'subnet': relationship.target_id
                            });
                        }
                    });
                }
            });

            return ports;
        }

        function _resetNetworkColors() {
            _colors.idx = 0;
        }

        function _getNetworkColors() {
            return _colors.colors;
        }

        function _getNetworkColor() {
            _colors.idx = _colors.idx < _colors.colors.length ? _colors.idx + 1 : 0;
            return _colors.colors[_colors.idx];
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

        function _getSubnetByNetwork(network_id) {
            var subnet = {};
            networkModel.networks.forEach(function(network) {
                if (network.id === network_id) {
                    subnet = network.subnets[0];
                }
            });
            return subnet;
        }

        function _addRelation(relation) {
            for(var i in networkModel.relations) {
                if((relation.source + relation.target) === (networkModel.relations[i].source + networkModel.relations[i].target)) {
                    return;
                }
            }
            networkModel.relations.push(relation);
        }

        function isDevice(node) {
            var validDevices = [
                'router',
                'server'
            ];
            var result = false;
            node.type_hierarchy.forEach(function(type) {
                validDevices.forEach(function(deviceType) {
                    if (type.substr(type.lastIndexOf('.') + 1).toLowerCase().indexOf(deviceType) > -1) {
                        result = true;
                    }
                });
            });

            return result;
        }

        this.createNetworkTree = _createNetworkTree;
        this.resetNetworkColors = _resetNetworkColors;
        this.getNetworkColors = _getNetworkColors;
        this.getNetworkColor = _getNetworkColor;

    });
