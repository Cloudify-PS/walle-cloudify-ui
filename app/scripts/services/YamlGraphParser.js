'use strict';

angular.module('cosmoUi')
    .service('YamlGraphParser', function ( PlanData ) {
        var planData = PlanData.newInstance();

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
                json.nodes = _updateTypes(parsedData.serviceTemplates);
                json.edges = parsedData.relationships;
            }

            function _updateTypes(templates) {
                var updatedArr = templates;

                for (var i = 0; i < updatedArr.length; i++) {
                    for (var j = 0; j < parsedData.types.length; j++) {
                        if (updatedArr[i].id !== 'root') {
                            if ($.inArray(updatedArr[i].type[0], parsedData.types[j]) > -1) {
                                updatedArr[i].type = parsedData.types[j];
                            }
                        }
                    }
                }

                return updatedArr;
            }

            function uniqueId() {
                return _nodeId++;
            }


            function _createNodes(topology) {
                var nodesArr = [];
                var nodeId = null;
                var node = null;

                // create nodes
                for (var nodeIndex = 0; nodeIndex < topology.length; nodeIndex++) {
                    nodeId = uniqueId();
                    node = topology[nodeIndex];
                    var myNode = {
                        id: nodeId,
                        name: node.name,
                        type: [node.type]

                    };
                    planData.addNode($.extend({ 'id': nodeId}, node) );
                    nodesArr.push(myNode);
                    nodeIdMapping[node.name] = myNode;
                }

                // create edges
                for (nodeIndex = 0; nodeIndex < topology.length; nodeIndex++) {

                    node = topology[nodeIndex];
                    nodeId = nodeIdMapping[node.name].id;
                    for (var i = 0; node.relationships !== undefined && i < node.relationships.length; i++) {
                        parsedData.relationships.push({
                            source: nodeId,
                            target: nodeIdMapping[node.relationships[i].target].id,
                            type: node.relationships[i].type
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


                if (result.types !== undefined) {
                    for (var type in result.types) {

                        var typeObj = result.types[type];
                        typeObj.name = type;
                        planData.addType( typeObj );

                        if ($.inArray(type, parsedData.types === -1)) {
                            var typeArr = [];
                            typeArr.push(type);
                            if (result.types[type].derived_from !== undefined) {
                                typeArr.push(result.types[type].derived_from);
                            }
                            parsedData.types.push(typeArr);
                        }
                    }
                }

                if (result.blueprint !== undefined) {

                    var templateValue = result.blueprint;
                    var topology = templateValue.hasOwnProperty('topology') ? templateValue.topology : undefined;

                    if (parsedData.serviceTemplates.length > 0) {
                        parsedData.serviceTemplates.concat(_createNodes(topology));
                    } else {
                        parsedData.serviceTemplates = _createNodes(topology);
                    }
                }

                _generateJSON();
            };
        }


        this.newInstance = function () {
            return new Parser();
        };


    });
