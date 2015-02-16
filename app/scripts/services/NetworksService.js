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
            external: [],
            networks: [],
            relations: []
        };

        var _colors = {
            idx: 0,
            colors:['#1F77B4', '#FF7F0E', '#2CA02C', '#D62728', '#9467BD', '#8C564B', '#4b6c8b', '#550000', '#dc322f', '#FF6600', '#cce80b', '#003300', '#805e00']
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
                external: [],
                networks: [],
                relations: []
            };
        }

        function _setExternalNetworks(providerData, nodes) {
            var extNetwork = providerData.context.resources.ext_network;
            var extSubnet = providerData.context.resources.subnet;

            /* external router */
            var extRouter = {
                'id': providerData.context.resources.router.id,
                'name': providerData.context.resources.router.name,
                'type': providerData.context.resources.router.type,
                'icon': 'router'
            };

            /* external network */
            var externalNetwork = {
                'id': extNetwork.id,
                'name': extNetwork.name,
                'color': _getNetworkColor(),
                'type': extNetwork.type,
                'routers': [extRouter]
            };
            networkModel.relations.push({
                source: externalNetwork.id,
                target: extRouter.id
            });
            networkModel.external.push(externalNetwork);

            /* external subnet */
            var externalSubnet = {
                'id': extSubnet.id,
                'name': extSubnet.name,
                'color': _getNetworkColor(),
                'type': extSubnet.type,
                'devices': _getDevices(nodes, networkModel.external)
            };
            networkModel.relations.push({
                source: extSubnet.id,
                target: extRouter.id
            });
            networkModel.external.push(externalSubnet);
        }

        function _setNetworkTree(nodes) {
            /* Networks */
            networkModel.networks = _getNetworks(nodes);
            networkModel.networks.forEach(function (network) {
//                network.devices = _getDevices(nodes, networkModel.external);
                network.subnets = _getSubnets(network, nodes);
            });
        }

        function _getNetworks(nodes) {
            var networks = [];

            nodes.forEach(function (node) {
                if (node.type.toLowerCase().indexOf('network') > -1) {
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
                if (node.type.toLowerCase().indexOf('subnet') > -1) {
                    var relationships = _getRelationshipByType(node, 'contained');
                    relationships = relationships.concat(_getRelationshipByType(node, 'connected'));
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

        function _getDevices(nodes) {
            /* Ports */
            var ports = _getPorts(nodes);
            var devices = [];

            nodes.forEach(function (node) {
                if (isDevice(node)) {
                    var device = {
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

                    var relationships = _getRelationshipByType(node, 'connected_to');//.concat(_getRelationshipByType(node, 'depends_on'));
                    relationships.forEach(function (relationship) {
                        if (ports.length > 0) {
                            ports.forEach(function (port) {
                                if (relationship.target_id === port.id) {
                                    var _alreadyExists = false;
                                    device.ports.forEach(function (item) {
                                        if (item.id === port.id) {
                                            _alreadyExists = true;
                                        }
                                    });
                                    if (!_alreadyExists) {
                                        device.ports.push(port);
                                        _addRelation({
                                            source: port.subnet,
                                            target: port.id
                                        });
                                    }
                                }
                            });
                        } else {
                            _addRelation({
                                source: node.id,
                                target: relationship.target_id
                            });
                        }
                    });

                    networkModel.external.forEach(function (extNetwork) {
                        if (extNetwork.type.toLowerCase() === 'subnet') {
                            _addRelation({
                                source: extNetwork.id,
                                target: node.id
                            });
                        }
                    });

                    if (device.type === 'router') {
                        networkModel.external[0].routers.push({
                            'id': device.id,
                            'name': device.name,
                            'type': device.type,
                            'icon': 'router'
                        });
                        _addRelation({
                            source: networkModel.external[0].id,
                            target: device.id
                        });
                    } else {
                        devices.push(device);
                    }
                }
            });

            return devices;
        }

        function _getPorts(nodes) {
            var ports = [];

            nodes.forEach(function (node) {
                if (node.type.indexOf('port') > -1) {
                    var relationships = _getRelationshipByType(node, 'depends_on');
                    relationships.forEach(function (relationship) {
                        if (relationship.type.toLowerCase().indexOf('depends_on') > -1) {
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
                'router'//,
//                'server'
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
