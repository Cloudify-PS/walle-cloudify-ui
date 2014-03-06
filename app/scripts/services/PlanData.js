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


angular.module('cosmoUi').service('PlanDataConvert', function () {
    /**
     * Convert Edges to Blueprint format
     * @param data
     * @returns Json
     */
    this.edgesToBlueprint = function (data) {
        var result = {};
        for (var i = 0; i < data.length; i++) {

            var edge = data[i];

            if (!result.hasOwnProperty(edge.type)) {
                result[edge.type] = [];
            }

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
        return result;
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
                        'type': getNodeType(node),
                        'iconType': getIconByType(node.type) || getNodeType(node),
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

    function getNodeType(node) {
        return node.type[0].split('_')[1];
    }

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
    var colorIndex = 0,
        colors = ['#d54931', '#f89406', '#149bdf', '#555869', '#8eaf26', '#330033', '#4b6c8b', '#550000', '#dc322f', '#FF6600', '#cce80b', '#003300', '#805e00'];

    var networkMap = {
        'neutron_network': 'network',
        'cloudify.openstack.network': 'network',
        'neutron_subnet': 'subnet',
        'cloudify.openstack.subnet': 'subnet',
        'neutron_router': 'router',
        'cloudify.types.host': 'host',
        'cloudify.types.web_server': 'server'
    };

    this.nodesToNetworks = function (data) {
        var topologyNodes = [];
        data.network = {
            'external': [{
                'name': 'External Netowrk',
                'subnets': [],
                'devices': []
            }],
            'networks': [],
            'relations': []
        };

        function _filterNodesToNetwork(nodes, callback) {
            for (var i in nodes) {
                var node = nodes[i];
                callback(node);
            }
        }

        if (data.hasOwnProperty('nodes')) {
            // First Locate Networks
            _filterNodesToNetwork(data.nodes, function(node){
                switch (getTypeByMap(node.type[0])) {
                case 'network':
                    addNetwork(data, node);
                    break;
                }
            });
            // Locate Subnets
            _filterNodesToNetwork(data.nodes, function(node){
                switch (getTypeByMap(node.type[0])) {
                case 'subnet':
                    addSubnet(data, node);
                    break;
                }
            });
            // Locate the rest
            _filterNodesToNetwork(data.nodes, function(node){
                switch (getTypeByMap(node.type[0])) {
                case 'router':
                    addRouter(data, node);
                    break;
                case 'host':
                    addDevice(data, node);
                    topologyNodes.push(node);
                    break;
                default:
                    topologyNodes.push(node);
                    break;
                }
            });
            data.nodes = topologyNodes;
        }
    };

    function getTypeByMap(type) {
        if(networkMap.hasOwnProperty(type)) {
            return networkMap[type];
        }
        return type;
    }

    function getRandomColor() {
        var color;
        if(colorIndex >= colors.length) {
            colorIndex = 0;
        }
        color = colors[colorIndex];
        colorIndex++;
        return color;
    }

    function addNetwork(data, node) {
        data.network.networks.push({
            'id': node.id,
            'name': node.name,
            'subnets': [],
            'devices': []
        });
        data.nodes.splice(data.nodes.indexOf(node), 1);
    }

    function addSubnet(data, node) {
        for (var i in data.edges) {
            var edge = data.edges[i];
            if (edge.type.search('contained_in') > 0 && node.id === edge.source) {
                var network = getNetworkById(data.network.networks, edge.target);
                network.subnets.push({
                    'id': node.id,
                    'name': node.name,
                    'cidr': '0.0.0.0/24',
                    'color': getRandomColor(),
                    'type': 'subnet'
                });
                addRelation(data, edge, true);
            }
        }
        data.nodes.splice(data.nodes.indexOf(node), 1);
    }

    function addDevice(data, node) {
        for (var i in data.edges) {
            var edge = data.edges[i];
            if (edge.type.search('connected_to') && node.id === edge.source) {
                var network = getNetworkById(data.network.networks, edge.target);
                if (network !== null) {
                    network.devices.push({
                        'id': node.id,
                        'name': node.name,
                        'type': 'device',
                        'icon': getIconByType(node.type[0])
                    });
                    addRelation(data, edge, true);
                }
            }
        }
    }

    function addRouter(data, node) {
        for (var i in data.edges) {
            var edge = data.edges[i];
            if (edge.type.search('connected_to') && node.id === edge.target) {
                if(!addExternalGateway(data, node)) {
                    var network = getNetworkBySubnetId(data.network.networks, edge.source);
                    if (network !== null) {
                        network.devices.push({
                            'id': node.id,
                            'name': node.name,
                            'type': 'device',
                            'icon': getIconByType(node.type[0])
                        });
                    }
                }
                addRelation(data, edge, true);
            }
        }
    }

    function addExternalGateway(data, node) {
        if (node.properties.router.hasOwnProperty('external_gateway_info')) {
            var gateway = node.properties.router.external_gateway_info,
                external = data.network.external[0];

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
                'icon': getIconByType(node.type[0])
            });
            addRelation(data, {
                'source': 0,
                'target': node.id
            }, false);

            return true;
        }
        return false;
    }

    function addRelation(data, edge, remove) {
        data.network.relations.push(edge);
        if(remove === true) {
            data.edges.splice(data.edges.indexOf(edge), 1);
        }
    }

    function getNetworkById(networks, id) {
        for (var i = 0; i < networks.length; i++) {
            var network = networks[i];
            if (network.id === id) {
                return network;
            }
        }
    }

    function getNetworkBySubnetId(networks, id) {
        for (var i = 0; i < networks.length; i++) {
            var network = networks[i];
            for(var s in network.subnets) {
                var subnet = network.subnets[s];
                if (subnet.id === id) {
                    return network;
                }
            }
        }
        return null;
    }

    function getIconByType(type) {
        switch(getTypeByMap(type)) {
        case 'server':
            return 'server';
        case 'host':
            return 'host';
        case 'router':
            return 'router';
        }
    }

});