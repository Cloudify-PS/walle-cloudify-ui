'use strict';

/**
 * @ngdoc service
 * @name cosmoUiApp.UpdateNodes
 * @description
 * # UpdateNodes
 * Service in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
    .service('UpdateNodes', function UpdateNodes() {

        function UpdateNodesObject() {
            var _nodesInstances = [];
            var _nodesList = [];


            function _runUpdate(nodesInstances, nodesList) {
                _nodesInstances = nodesInstances;
                _nodesList = nodesList;

                for (var i in _nodesInstances) {
                    var node = _nodesInstances[i];
                    _addPublicIpToNode(node);
                }
            }

            function _addPublicIpToNode(node) {
                var _idsAddresses = [];
                if(node.hasOwnProperty('relationships')) {
                    for(var i in node.relationships) {
                        var relation = node.relationships[i];
                        var relatedNode = _findNodeById(relation.target_id, _nodesInstances);

                        if(_checkForValidType(relatedNode, 'VirtualIP')) {
                            if(relatedNode.hasOwnProperty('runtime_properties') &&
                                relatedNode.runtime_properties !== null &&
                                relatedNode.runtime_properties.hasOwnProperty('floating_ip_address')) {
                                _idsAddresses.push(relatedNode.runtime_properties.floating_ip_adress);
                            }
                        }
                    }
                }
                _addNewProperty(node, 'ip_addresses', _idsAddresses);
            }

            function _findNodeById(id, nodes) {
                for (var i in nodes) {
                    var node = nodes[i];
                    if (node.id === id) {
                        return node;
                    }
                }
            }

            function _checkForValidType(nodeInstance, type) {
                var node = _findNodeById(nodeInstance.node_id, _nodesList);

                if (typeof(node) === 'object' && node.hasOwnProperty('type_hierarchy')) {
                    for (var i in node.type_hierarchy) {
                        var nodeType = node.type_hierarchy[i];

                        if (nodeType.indexOf(type) !== -1) {
                            return true;
                        }
                    }
                }

                return false;
            }

            function _addNewProperty(node, field, value) {
                if(node.runtime_properties === null) {
                    node.runtime_properties = {};
                }
                if(!node.runtime_properties.hasOwnProperty(field)) {
                    node.runtime_properties[field] = value;
                }
            }

            return {
                runUpdate: _runUpdate
            };
        }

        this.newInstance = function _newInstance() {
            return new UpdateNodesObject();
        };
    });
