'use strict';

angular.module('cosmoUiApp')
    .service('NodeService', function NodeService(TopologyTypes, nodeStatus ) {

        this.status = nodeStatus; // use is from here.

        function _createNodesTree(nodes) {
            var roots = [];
            var nodesList = _orderTheNodes(nodes);

            for (var nodeId in nodesList) {
                var node = nodesList[nodeId];

                if (node.relationships !== undefined && !_isIgnoreNode(node) && !_isNetworkNode(node)) {
                    for (var i = 0; i < node.relationships.length; i++) {
                        if (node.relationships[i].type_hierarchy.join(',').indexOf('contained_in') > -1) {
                            node.isContained = true;
                            var target_id = node.relationships[i].target_id;
                            if (nodesList[target_id].children === undefined) {
                                nodesList[target_id].children = [];
                            }
                            nodesList[target_id].children.push(node);
                        }
                        if (node.relationships[i].type_hierarchy.join(',').indexOf('connected_to') > -1) {
                            node.relationships[i].node = nodesList[node.relationships[i].target_id];
                        }
                        if (i === node.relationships.length - 1 && node.isContained === undefined) {
                            node.isContained = false;
                        }
                    }

                    node.dataType = _getNodeDataType(node);

                    if (!node.isContained) {
                        if(node.hasOwnProperty('children')) {
                            node.children.sort(_sortBy('id'));
                        }
                        roots.push(node);
                    }
                } else if(!_isIgnoreNode(node) && !_isNetworkNode(node) && !node.isContained){
                    node.dataType = _getNodeDataType(node);
                    if(node.hasOwnProperty('children')) {
                        node.children.sort(_sortBy('id'));
                    }
                    roots.push(node);
                }
            }

            return roots;
        }

        function _sortBy(key, reverse) {
            var moveSmaller = reverse ? 1 : -1;
            var moveLarger = reverse ? -1 : 1;

            return function (a, b) {
                if (a[key] < b[key]) {
                    return moveSmaller;
                }
                if (a[key] > b[key]) {
                    return moveLarger;
                }
                return 0;
            };
        }

        function _orderTheNodes(nodes) {
            nodes.sort(_sortBy('id'));

            var orderedNodes = {};
            nodes.forEach(function(node) {
                node.class = _getNodeClass(node.type_hierarchy);
                node.isApp = _isAppNode(node.type_hierarchy);
                node.isHost = _isHostNode(node.type_hierarchy);
                orderedNodes[node.id] = node;
            });
            return orderedNodes;
        }

        function _getNodeClass(typeHierarchy) {
            for (var i = 0; i < typeHierarchy.length; i++) {
                typeHierarchy[i] = typeHierarchy[i].split('.').join('-').split('_').join('-');
            }
            return typeHierarchy.join(' ');
        }

        function _isAppNode(typeHierarchy) {
            return TopologyTypes.isAppNode(typeHierarchy);
        }

        function _isHostNode(typeHierarchy) {
            return TopologyTypes.isHostNode(typeHierarchy);
        }

        function _isNetworkNode(node) {
            return TopologyTypes.isNetworkNode(node);
        }

        function _isIgnoreNode(node) {
            var ignoredNodes = [
                'cloudify-nodes-SecurityGroup',
                'cloudify-nodes-KeyPair'
            ];

            var searchExp = new RegExp(ignoredNodes.join('|'), 'gi');
            return searchExp.test(node.type_hierarchy);
        }

        function _getNodeDataType(node) {
            if (!node.isContained) {
                return 'compute';
            } else if (node.isContained && !_isAppNode(node.type_hierarchy)) {
                return 'middleware';
            } else if (node.isContained && _isAppNode(node.type_hierarchy)) {
                return 'modules';
            }
        }

        function _getInstanceType(instance, nodes) {
            var id = instance.node_id;
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].id === id) {
                    return nodes[i].type;
                }
            }
            return 'N/A';
        }

        this.createNodesTree = _createNodesTree;
        this.getInstanceType = _getInstanceType;


        /**
         * @returns true iff relationship is connected to
         * @param relationship
         */
        this.isConnectedTo = function( relationship ){
            try {
                return relationship.type_hierarchy.join(',').indexOf('connected_to') && TopologyTypes.isValidConnection(relationship.node);
            }catch(e){
                return false;
            }
        };

        this.getConnections = function(nodes, type) {
            var connections = [];
            _.each(nodes.forEach(function (node) {
                var relationships = _.filter(node.relationships, function(rel){ //
                    return rel.type_hierarchy.join(',').indexOf(type) > -1;
                });
                _.each(relationships, function(rel) {
                    connections.push({
                        source: node.id,
                        target: rel.target_id,
                        type: rel.type,
                        typeHierarchy: rel.type_hierarchy
                    });
                });
            }));
            return connections;
        };





    });
