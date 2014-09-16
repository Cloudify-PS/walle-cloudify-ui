'use strict';

/**
 * @ngdoc function
 * @name cosmoUiAppApp.controller:BlueprintNetworkCtrl
 * @description
 * # BlueprintnetworkCtrl
 * Controller of the cosmoUiAppApp
 */
angular.module('cosmoUiApp')
    .controller('BlueprintNetworkCtrl', function ($scope, $routeParams, RestService, bpNetworkService) {

        $scope.blueprintId = $routeParams.blueprintId;
        $scope.networks = [];

        var relations = [];
        var _colors = ['#d54931', '#f89406', '#149bdf', '#555869', '#8eaf26', '#330033', '#4b6c8b', '#550000', '#dc322f', '#FF6600', '#cce80b', '#003300', '#805e00'];
        var _colorIdx = 0;

        function getNetworkColor() {
            _colorIdx = _colorIdx < _colors.length ? _colorIdx + 1 : 0;
            return _colors[_colorIdx];
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
                network.subnets = _getSubnets(network, nodes); /* Subnets */
                network.devices = _getDevices(nodes, networkModel.external); /* Devices */
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
                                'color': getNetworkColor(),
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
                                var _alreadyExists = false;
                                device.ports.forEach(function(item) {
                                    if (item.id === port.id) {
                                        _alreadyExists = true;
                                    }
                                });
                                if (!_alreadyExists) {
                                    device.ports.push(port);
                                    relations.push({
                                        source: port.subnet,
                                        target: port.id
                                    });
                                }
                            }
                        });
                    });

                    externalNetworks.forEach(function (extNetwork) {
                        if (extNetwork.type === 'subnet') {
                            relations.push({
                                source: extNetwork.id,
                                target: node.id
                            });
                        }
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
                    relationships.forEach(function(relationship) {
                        if (relationship.type.indexOf('depends_on') > -1) {
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


        $scope.$on('blueprintData', function(event, data){

            RestService.getProviderContext()
                .then(function(providerData) {
                    var _extNetworks = [];
                    var externalNetwork = {
                        'id': providerData.context.resources.ext_network.id,
                        'name': providerData.context.resources.ext_network.name,
                        'color': getNetworkColor(),
                        'type': providerData.context.resources.ext_network.type
                    };
                    externalNetwork.color = getNetworkColor();
                    externalNetwork.devices = [
                        {
                            'id': providerData.context.resources.router.id,
                            'name': providerData.context.resources.router.name,
                            'type': providerData.context.resources.router.type,
                            'icon': 'router'
                        }
                    ];
                    relations.push({
                        source: externalNetwork.id,
                        target: externalNetwork.devices[0].id
                    });
                    _extNetworks.push(externalNetwork);

                    var subNetwork = providerData.context.resources.subnet;
                    subNetwork.color = getNetworkColor();
                    relations.push({
                        source: subNetwork.id,
                        target: externalNetwork.devices[0].id
                    });
                    _extNetworks.push(subNetwork);

                    $scope.networks = _createNetworkTree(data.plan.nodes);
                    bpNetworkService.setMap($scope.networks.relations);
                    $scope.networkcoords = bpNetworkService.getCoordinates();
                });

        });

    });
