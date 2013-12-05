'use strict';

angular.module('cosmoUi')
    .service('YamlGraphParser', function YamlGraphParser() {
        // AngularJS will instantiate a singleton by calling "new" on this function


        function Parser() {

            var json = {};
            var parsedData = {
                types: [],
                serviceTemplates: [],
                relationships: []
            };
            var _nodeId = 1;
            var nodeIdMapping = {};


            function _generateJSON() {
                json = {};
                json.nodes = parsedData.nodes;//_updateTypes(parsedData.serviceTemplates);
                json.edges = parsedData.relationships;
            }

//            function _updateTypes(templates) {
//                var updatedArr = templates;
//
//                for (var i = 0; i < updatedArr.length; i++) {
//                    for (var j = 0; j < parsedData.types.length; j++) {
//                        if (updatedArr[i].id !== 'root') {
//                            if ($.inArray(updatedArr[i].type[0], parsedData.types[j]) > -1) {
//                                updatedArr[i].type = parsedData.types[j];
//                            }
//                        }
//                    }
//                }
//
//                return updatedArr;
//            }

            function uniqueId() {
                return _nodeId++;
            }

            function _createNodes(topology) {
                var nodesArr = [];
                var nodeId = null;
                var node = null;

                // create nodes
                for (var nodeIndex = 0; nodeIndex < topology.nodes.length; nodeIndex++) {
                    nodeId = uniqueId();
                    node = topology.nodes[nodeIndex];
                    var myNode = {
                        id: nodeId,
                        name: node.id,
                        type: [node.type],
                        properties: node.properties,
                        policies: node.policies,
                        general: null/*, type, name, numOfInstances, description, relationships */

                    };
                    planData.addNode($.extend({ 'id': nodeId}, node) );
                    nodesArr.push(myNode);
                    nodeIdMapping[node.id] = myNode;
                }
                parsedData.nodes = nodesArr;

                // create edges
                var mapCallback = function(value) {
                    return [value];
                };
                for (nodeIndex = 0; nodeIndex < topology.nodes.length; nodeIndex++) {
                    node = topology.nodes[nodeIndex];
                    nodeId = nodeIdMapping[node.id].id;
                    var relationshipsArr = [];
                    if (node.relationships !== undefined) {
                        relationshipsArr = $.map(node.relationships, mapCallback);
                    }
                    for (var i = 0; relationshipsArr.length > 0 && i < relationshipsArr.length; i++) {
                        parsedData.relationships.push({
                            source: nodeId,
                            target: nodeIdMapping[relationshipsArr[i].target_id].id,
                            type: relationshipsArr[i].type
                        });
                    }
                }

                return nodesArr;
            }


            this.getParsedResult = function () {
                planData.setJSON( json );
                return planData;
            };

            this.parseResult = function (result) {
//                console.log(["parsing",result]);

//                if (result.types !== undefined) {
//                    for (var type in result.types) {
//                        if ($.inArray(type, parsedData.types === -1)) {
//                            var typeArr = [];
//                            typeArr.push(type);
//                            if (result.types[type].derived_from !== undefined) {
//                                typeArr.push(result.types[type].derived_from);
//                            }
//                            parsedData.types.push(typeArr);
//                        }
//                    }
//                }

//                if (result.application_template !== undefined) {
//                    var templateValue = result.application_template;
//                    var topology = templateValue.hasOwnProperty('topology') ? templateValue.topology : undefined;
//
//                    if (parsedData.serviceTemplates.length > 0) {
//                        parsedData.serviceTemplates.concat(_createNodes(topology));
//                    } else {
//                        parsedData.serviceTemplates = _createNodes(topology);
//                    }
//                }

                _createNodes(result);

                _generateJSON();
            };
        }


        this.newInstance = function () {
            return new Parser();
        };


    });
