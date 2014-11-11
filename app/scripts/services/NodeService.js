'use strict';

angular.module('cosmoUiApp')
    .service('NodeService', function NodeService() {

        function _createNodesTree(nodes) {
            var roots = [];
            var nodesList = _orderTheNodes(nodes);

            for (var nodeId in nodesList) {
                var node = nodesList[nodeId];

                if (node.relationships !== undefined && !_isIgnoreNode(node)) {
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
                        if(node.hasOwnProperty('childern')) {
                            node.childern.sort(_sortBy('id'));
                        }
                        roots.push(node);
                    }
                } else if(!_isIgnoreNode(node) && !node.isContained){
                    node.dataType = _getNodeDataType(node);
                    if(node.hasOwnProperty('childern')) {
                        node.childern.sort(_sortBy('id'));
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

            var orderedNodes = [];
            nodes.forEach(function(node) {
                node.class = _getNodeClass(node.type_hierarchy);
                node.isApp = _isAppNode(node.type_hierarchy);
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

        // TODO: 3.2 - Move method to topologyTypes and use the service instead of local function
        function _isAppNode(typeHierarchy) {
            return typeHierarchy.indexOf('cloudify-nodes-ApplicationModule') > 0;
        }

        // TODO: 3.2 - Move method to topologyTypes and use the service instead of local function
        function _isIgnoreNode(node) {
            var networkNodes = [
                'FloatingIp',
                'Network',
                'Port',
                'Subnet',
                'SecurityGroup'
            ];

            var searchExp = new RegExp(networkNodes.join('|'), 'gi');
            return searchExp.test(node.type);
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

        this.createNodesTree = _createNodesTree;
    });
