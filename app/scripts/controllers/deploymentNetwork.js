'use strict';

/**
 * @ngdoc function
 * @name cosmoUiAppApp.controller:DeploymentNetworkCtrl
 * @description
 * # DeploymentnetworkCtrl
 * Controller of the cosmoUiApp
 */
angular.module('cosmoUiApp')
    .controller('DeploymentNetworkCtrl', function ($scope, $routeParams, $timeout, RestService, bpNetworkService) {

        $scope.deploymentId = $routeParams.deploymentId;

        var nodes = [];
        var relations = [];
        var _colors = ['#1F77B4', '#FF7F0E', '#2CA02C', '#D62728', '#9467BD', '#8C564B', '#4b6c8b', '#550000', '#dc322f', '#FF6600', '#cce80b', '#003300', '#805e00'];
        var _colorIdx = 0;

        $scope.$on('nodesList', function(e, nodesList){
            nodes = nodesList;
        });

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
                if (node.type.indexOf('subnet') > -1) {
                    var relationships = $scope.getRelationshipByType(node, 'contained');
                    relationships.forEach(function (relationship) {
                        if (network.id === relationship.target_id) {
                            subnets.push({
                                'id': node.id,
                                'name': node.properties.subnet.name ? node.properties.subnet.name : node.name,
                                'cidr': node.properties.subnet.cidr,
                                'color': getNetworkColor(),
                                'type': 'subnet',
                                'state': {
                                    'total': node.number_of_instances,
                                    'completed': 0
                                }
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
                        'state': {
                            'total': node.number_of_instances,
                            'completed': 0
                        },
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

                $scope.networks = _createNetworkTree(nodes, _extNetworks);

                bpNetworkService.setMap($scope.networks.relations);
                $timeout(function(){
                    $scope.networkcoords = bpNetworkService.getCoordinates();
                    bpNetworkService.render();
                }, 100);
            });

        $scope.viewNodeDetails = function (viewNode) {
            $scope.viewNode = viewNode;
        };

    });
