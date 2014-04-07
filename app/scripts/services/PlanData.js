'use strict';

angular.module('cosmoUi').service('PlanData', function () {

    // AngularJS will instantiate a singleton by calling "new" on this function

    function DataWrapper() {
        var nodesMap = {}; // id to node map
        var typesMap = {}; // map between name and type
        var nodesList = []; //
        var typesList = [];
        var json = {};

        // returns node from which we inherit or NULL if cannot find one
        function _addType(type) {
            if (!typesMap.hasOwnProperty(type.name)) {
                console.log(['adding type', type.name, type]);
                typesMap[type.name] = type;
                typesList.push(type);
            } else {
                console.log(['got duplicate definition for type ', type, typesMap[type.name]  ]);
            }
        }

        function _addNode(node) {
            nodesMap[node.uid] = node;
            nodesList.push(node);
        }

        function _getJSON() {
            // we need to remove this and use the interface instead.
            return json;
        }

        function _getNodesList() {
            return nodesList;
        }

        function _getTypesList() {
            return typesList;
        }

        function _getNode(nodeId) {
            return nodesMap[nodeId];
        }

        this.addNode = _addNode;
        this.getProperties = function (node) {
            return node.properties;
        };
        this.getPolicies = function (node) {
            return node.policies;
        };
        this.getRelationships = function (node) {
            return node.relationships;
        };
        this.addType = _addType;
        this.getNodes = _getNodesList;
        this.getTypes = _getTypesList;
        this.getGeneralInfo = function (node) {
            var result = {
                'name': node.id,
                'type': node.type
            };
            return result;
        };
        this.getNode = _getNode;
        this.getJSON = _getJSON;
        this.setJSON = function (_json) {
            json = _json;
        };
    }

    this.newInstance = function () {
        return new DataWrapper();
    };


});


angular.module('cosmoUi').service('PlanDataConvert', function (Cosmotypesservice) {
    /**
     * Convert Edges to Blueprint format
     * @param data
     * @returns Json
     */
    this.edgesToBlueprint = function (data) {
        var result = {};
        for (var i in data) {
            var edge = data[i];
            if (!result.hasOwnProperty(edge.type)) {
                result[edge.type] = [];
            }
            if(edge.type.search('contained_in') !== -1) {
                var sourceNode = findNode(result[edge.type], edge.type, edge.source);
                var targetNode = findNode(result[edge.type], edge.type, edge.target);
                if (sourceNode === null) {
                    sourceNode = {'id': edge.source, type: edge.type};
                }
                if (targetNode === null) {
                    targetNode = {'id': edge.target, type: edge.type};
                    result[edge.type].push(targetNode);
                }
                addChild(targetNode, sourceNode);
                if (result[edge.type].indexOf(sourceNode) >= 0) {
                    result[edge.type].splice(result[edge.type].indexOf(sourceNode), 1);
                }
            }
            else {
                result[edge.type].push(edge);
            }
        }
        return result;
    };

    this.allocateAbandonedNodes = function (topology, dataMap) {
        function _isAbandonedNode(node) {
            for(var t in topology.edges) {
                var edge = topology.edges[t];
                if(edge.source === node.id || edge.target === node.id) {
                    return false;
                }
            }
            return true;
        }
        if(!dataMap.hasOwnProperty('cloudify.relationships.contained_in')) {
            dataMap['cloudify.relationships.contained_in'] = [];
        }
        for (var n in topology.nodes) {
            var node = topology.nodes[n];
            if(_isAbandonedNode(node)) {
                dataMap['cloudify.relationships.contained_in'].push({
                    'children': [],
                    'id': node.id,
                    'type': 'cloudify.relationships.contained_in'
                });
            }
        }
    };

    function findNode(tree, type, id) {
        for (var i = 0; i < tree.length; i++) {
            var node = tree[i];
            if (node.id === id) {
                return node;
            }
            else if (node.hasOwnProperty('children')) {
                var childNode = findNode(node.children, type, id);
                if (childNode !== null) {
                    return childNode;
                }
            }
        }
        return null;
    }

    function addChild(node, child) {
        if (!node.hasOwnProperty('children')) {
            node.children = [];
        }
        node.children.push(child);
    }

    this.nodesToTopology = function(data){

        var noneTopologyTypes = ['network', 'subnet', 'port', 'router', 'floating-ip', 'security-group'];
        var topologyModel = {
            'edges': [],
            'nodes': []
        };

        function _foreach(data, fnCallback) {
            for (var i in data) {
                fnCallback(data[i]);
            }
        }

        function _isNotType(type, equalTo) {
            return equalTo.indexOf(Cosmotypesservice.getTypeData(type).baseType) === -1;
        }

        function _getRelations(nodeId, type) {
            var _edges = [];
            _foreach(data.edges, function (edge) {
                var edgeType = edge.type.split('.').slice(-1)[0];
                if ((edge.source === nodeId || edge.target === nodeId) && (type === undefined || type.indexOf(edgeType) > -1)) {
                    _edges.push(edge);
                }
            });
            return _edges;
        }

        function _addRelation(relation) {
            if(topologyModel.edges.indexOf(relation) === -1) {
                topologyModel.edges.push(relation);
            }
        }

        _foreach(data.nodes, function(node){
            if(_isNotType(node.type[0], noneTopologyTypes)) {
                var relations = _getRelations(node.id, ['connected_to', 'contained_in']);
                topologyModel.nodes.push(node);
                _foreach(relations, function(relation){
                    _addRelation(relation);
                });
            }
        });

        return topologyModel;
    };

    /**
     * Convert nodes data to table format
     */
    this.nodesToTable = function (data) {
        var dataTable = [];
        if (data.hasOwnProperty('edges') && data.hasOwnProperty('nodes') && !!data.edges && !!data.nodes) {
            for (var i = 0; i < data.nodes.length; i++) {
                if(data.nodes[i]) {
                    var node = data.nodes[i];
                    dataTable.push({
                        'id': node.id,
                        'type': node.type,
                        'name': node.name,
                        'instances': node.general.numOfInstances,
                        'contained_in': getContainedIn(node, data.edges),
                        'connected_to': getConnectedTo(node, data.edges)
                    });
                }
            }
            return dataTable;
        }
        else {
            console.warn('Missing data: cannot convert nodes to table [ PlanDataConvert.nodesToTable() ]');
        }
    };

    function getContainedIn(node, edges) {
        for (var x = 0; x < edges.length; x++) {
            var edge = edges[x];
            if (edge.type.indexOf('contained_in') > 0) {
                if (edge.source === node.id) {
                    return edge.target;
                }
            }
        }
        return false;
    }

    function getConnectedTo(node, edges) {
        var connections = [];
        for (var x = 0; x < edges.length; x++) {
            var edge = edges[x];
            if (edge.type.indexOf('connected_to') > 0) {
                if (edge.source === node.id) {
                    connections.push(edge.target);
                }
            }
        }
        return connections;
    }

    /***
     * Networks
     */

    this.nodesToNetworks = function (data) {

        var colorIndex = 0,
            colors = ['#d54931', '#f89406', '#149bdf', '#555869', '#8eaf26', '#330033', '#4b6c8b', '#550000', '#dc322f', '#FF6600', '#cce80b', '#003300', '#805e00'],
            networkModel = {
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

        function _foreach(data, fnCallback) {
            for (var i in data) {
                fnCallback(data[i]);
            }
        }

        function _isType(type, equalTo) {
            return equalTo.indexOf(Cosmotypesservice.getTypeData(type).baseType) > -1;
        }

        function _addRelation(edge) {
            networkModel.relations.push(edge);
        }

        function _getRelationsBySource(source, type) {
            var _edges = [];
            _foreach(data.edges, function (edge) {
                var edgeType = edge.type.split('.').slice(-1)[0];
                if (edge.source === source && (type === undefined || type.indexOf(edgeType) > -1)) {
                    _edges.push(edge);
                }
            });
            return _edges;
        }

        function _getRelationsByTarget(target, type) {
            var _edges = [];
            _foreach(data.edges, function (edge) {
                var edgeType = edge.type.split('.').slice(-1)[0];
                if (edge.target === target && (type === undefined || type.indexOf(edgeType) > -1)) {
                    _edges.push(edge);
                }
            });
            return _edges;
        }

        function _getNetworkById(id) {
            for (var i in networkModel.networks) {
                var network = networkModel.networks[i];
                if (network.id === id) {
                    return network;
                }
            }
            return null;
        }

        function _getSubnetNetworkById(id) {
            for (var i in networkModel.networks) {
                var network = networkModel.networks[i];
                for (var s in network.subnets) {
                    var subnet = network.subnets[s];
                    if (subnet.id === id) {
                        return network;
                    }
                }
            }
            return null;
        }

        function _getPortById(id) {
            var port = null;
            _foreach(data.nodes, function (node) {
                if (node.id === id && _isType(node.type[0], ['port'])) {
                    port = node;
                    return;
                }
            });
            return port;
        }

        function _getRandomColor() {
            var color;
            if (colorIndex >= colors.length) {
                colorIndex = 0;
            }
            color = colors[colorIndex];
            colorIndex++;
            return color;
        }

        function _addNetworks(nodes) {
            _foreach(nodes, function (node) {
                if (_isType(node.type[0], ['network'])) {
                    networkModel.networks.push({
                        'id': node.id,
                        'name': node.name,
                        'subnets': [],
                        'devices': []
                    });
                }
            });
        }

        function _addSubnets(nodes) {
            _foreach(nodes, function (node) {
                if (_isType(node.type[0], ['subnet'])) {
                    var relations = _getRelationsBySource(node.id, ['contained_in']);
                    _foreach(relations, function (relation) {
                        var network = _getNetworkById(relation.target);
                        if (network !== null) {
                            network.subnets.push({
                                'id': node.id,
                                'name': node.name,
                                'cidr': node.properties.subnet.cidr,
                                'color': _getRandomColor(),
                                'type': 'subnet'
                            });
                            _addRelation(relation);
                        }
                    });
                }
            });
        }

        function _addDevices(nodes) {
            _foreach(nodes, function (node) {
                if (_isType(node.type[0], ['host'])) {
                    var relations = _getRelationsBySource(node.id, ['connected_to', 'depends_on']);
                    _foreach(relations, function (relation) {
                        var port = _getPortById(relation.target);
                        if (port !== null) {
                            _addPort(port, node);
                        }
                        else {
                            var network = _getSubnetNetworkById(relation.target);
                            if (network !== null) {
                                network.devices.push({
                                    'id': node.id,
                                    'name': node.name,
                                    'type': 'device',
                                    'icon': Cosmotypesservice.getTypeData(node.type[0]).baseType
                                });
                                _addRelation({source: relation.target, target: relation.source});
                            }
                        }
                    });
                }
            });
        }

        function _addRouters(nodes) {
            _foreach(nodes, function (node) {
                if (_isType(node.type[0], ['router'])) {
                    var relations = _getRelationsByTarget(node.id, ['subnet_connected_to_router']);
                    _foreach(relations, function (relation) {
                        if(!_addExternalGateway(node)) {
                            var network = _getSubnetNetworkById(relation.target);
                            if (network !== null) {
                                network.devices.push({
                                    'id': node.id,
                                    'name': node.name,
                                    'type': 'device',
                                    'icon': Cosmotypesservice.getTypeData(node.type[0]).baseType,
                                    'ports': node.ports
                                });
                            }
                        }
                        _addRelation(relation);
                    });
                }
            });
        }

        function _addPort(port, node) {
            if(!node.hasOwnProperty('ports')) {
                node.ports = [];
            }
            node.ports.push({
                'id': port.id,
                'name': port.name,
                'type': 'device',
                'icon': Cosmotypesservice.getTypeData(port.type[0]).baseType
            });
            var relations = _getRelationsBySource(port.id, ['depends_on']);
            _foreach(relations, function(relation){
                var network = _getSubnetNetworkById(relation.target);
                if(network !== null) {
                    network.devices.push({
                        'id': node.id,
                        'name': node.name,
                        'type': 'device',
                        'icon': Cosmotypesservice.getTypeData(node.type[0]).baseType,
                        'ports': node.ports
                    });
                    _addRelation({source: relation.target, target: relation.source});
                }
            });
        }

        function _addExternalGateway(node) {
            if (node.properties.router.hasOwnProperty('external_gateway_info')) {
                var gateway = node.properties.router.external_gateway_info, external = networkModel.external[0];
                external.subnets.push({
                    'id': 0,
                    'name': gateway.network_name,
                    'color': '#999',
                    'type': 'subnet'
                });
                external.devices.push({
                    'id': node.id,
                    'name': node.name,
                    'type': 'device',
                    'icon': Cosmotypesservice.getTypeData(node.type[0]).baseType
                });
                _addRelation({'source': 0, 'target': node.id});
                return true;
            }
            return false;
        }

        if (data.hasOwnProperty('nodes')) {
            _addNetworks(data.nodes);
            _addSubnets(data.nodes);
            _addDevices(data.nodes);
            _addRouters(data.nodes);
        }

        return networkModel;
    };

});