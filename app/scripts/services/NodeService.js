'use strict';

angular.module('cosmoUiApp')
    .service('NodeService', function NodeService() {

        function _createNodesTree(nodes, reverse) {
            var roots = [];
            var nodesList = _orderTheNodes(nodes);

            for (var nodeId in nodesList) {
                var node = nodesList[nodeId];
                node.class = _getNodeClass(node.type_hierarchy);
                node.isApp = _isAppNode(node.type_hierarchy);

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
                        if (i === node.relationships.length - 1 && node.isContained === undefined) {
                            node.isContained = false;
                        }
                    }

                    node.dataType = _getNodeDataType(node);

                    if (!node.isContained) {
                        roots.push(node);
                    }
                } else if(!_isIgnoreNode(node) && !node.isContained){
                    node.dataType = _getNodeDataType(node);
                    roots.push(node);
                }
            }

            if(reverse === true) {
                return roots.reverse();
            }
            return roots;
        }

        function _orderTheNodes(nodes) {
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

            nodes.sort(_sortBy('name'));

            var orderedNodes = [];
            nodes.forEach(function(node) {
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
            return typeHierarchy.indexOf('cloudify-types-app-module') > 0;
        }

        function _isIgnoreNode(node) {
            var networkNodes = [
                'floatingip',
                'network',
                'port',
                'subnet',
                'security_group',
                'subnet'
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
