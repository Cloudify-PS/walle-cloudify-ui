'use strict';

angular.module('cosmoUi')
    .service('YamlGraphParser', function YamlGraphParser( PlanData ) {
        // AngularJS will instantiate a singleton by calling "new" on this function
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


            // positive if a before b
            function sortByType( a , b ){
                return typesOrder.indexOf(a.type[0]) - typesOrder.indexOf(b.type[0]);
            }

            function sortByName( a, b ){ // ugly hack until we figure out bugs in charts
                return namesOrder.indexOf(a.name) - typesOrder.indexOf(b.name);
            }

            function _generateJSON() {
                json = {};
                json.nodes = parsedData.nodes.sort(sortByName).sort(sortByType);//_updateTypes(parsedData.serviceTemplates);
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

            var typesOrder = [
                'cloudify.types.host',
                'cloudify.types.middleware_server',
                'cloudify.types.app_module'

            ];

            var namesOrder = [
                'webserver_host',
                'postgres_host',


            ];

            var realTypes = {
                'mezzanine_app_module':'cloudify.types.app_module',
                'mezzanine_host': 'cloudify.types.host',
                'mezzanine_middleware': 'cloudify.types.middleware_server'
            };

            function extractName( uglyName ){
                var prettyName = uglyName.split('.')[1];
                if(prettyName !== undefined) {
                    return prettyName;
                }
                return uglyName;
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
                        name: extractName(node.id),
                        nodeId: node.id,
                        type: [ realTypes[node.type] || node.type ],
                        properties: node.properties,
                        policies: node.policies,
                        general: {/*, type, name, numOfInstances, description, relationships */
                            numOfInstances: node.instances.deploy
                        }

                    };
                    planData.addNode($.extend({ 'uid': nodeId}, node) );
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
                            type: relationshipsArr[i].type,
                            baseType: relationshipsArr[i].base
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
