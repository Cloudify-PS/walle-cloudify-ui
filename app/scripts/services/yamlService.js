'use strict';

angular.module('cosmoUi')
    .service('yamlService', function yamlService($http) {

//        var that,
//            json,
//            resultsArr,
//            requestCount,
//            responseCount,
//            nodeId,
//            callbackFunc;
//
//        this.init = function(appName, callback) {
//            that = this;
//            callbackFunc = callback;
//            requestCount = 0;
//            responseCount = 0;
//            nodeId = 0;
//            resultsArr = [];
//            json = {
//                'name': 'root',
//                'children': []
//            };
//
//            this.loadYaml(appName);
//        };
//
//        this.loadYaml = function(yamlName) {
//            var url;
//
//            requestCount++;
//
//            if (yamlName.substr(yamlName.lastIndexOf('.') + 1).toLowerCase() === 'yaml') {
//                url = '/plans/path/' + yamlName;
//            } else {
//                url = yamlName;
//            }
//
//            $http.get(url)
//                .success(function(data) {
//                    resultsArr[yamlName] = data;
//                    responseCount++;
//
//                    if (resultsArr[yamlName].definitions.imports !== undefined && resultsArr[yamlName].definitions.imports.length > 0) {
//                        _loadImports(resultsArr[yamlName].definitions.imports);
//                    }
//
//                    _generateJson();
//
//                    if (_isLoadingDone()) {
//                        callbackFunc();
//                    }
//                });
//        };
//
//        this.getJson = function() {
//            return json;
//        };
//
//        function _loadImports(imports) {
//            for(var i = 0; i < imports.length; i++) {
//                var importName = imports[i];
//                setTimeout(function(_import){
//                    return function() {
//                        that.loadYaml(_import);
//                    };
//                }(importName), 1);
//            }
//        }
//
//        function _isLoadingDone() {
//            return responseCount === requestCount;
//        }
//
//        function _findObjectByName(obj, name) {
//            for(var i in obj) {
//                if (i === name) {
//                    return obj[i];
//                }
//            }
//        }
//
//        function _generateJson() {
//            for (var node in resultsArr) {
//                nodeId++;
//                _addChild(node, resultsArr[node].definitions);
//            }
//
//        }
//
//        function _addChild(name, node) {
//            json.children.push({
//                'name': name,
//                'type': node.type !== undefined ? node.type : 'root',
//                'id': nodeId
//            });
//
//            if (_hasChildren(node)) {
//                _addChild();
//            }
//        }
//
//        function _hasChildren(node) {
//            if (node.relationships !== undefined && node.relationships.type.substr(nodes[i].type.lastIndexOf('.') + 1) === 'contained_in') {
//                return true;
//            } else {
//                return false;
//            }
//
//        }

        var that,
            parsedData,
            resultsArr,
            json,
            requestCount,
            responseCount,
            callbackFunc,
            nodeId,
            nodeIdMapping;

        this.init = function(appName, callback) {
            that = this;
            resultsArr = {};
            json = {};
            requestCount = 0;
            responseCount = 0;
            nodeId = 1;
            nodeIdMapping = [];
            callbackFunc = callback;
            parsedData = {
                imports: [],
                types: [],
                serviceTemplates: [],
                relationships: []
            };

            this.loadYaml(appName);
        };

        this.loadYaml = function(yamlName) {
            var url;

            requestCount++;

            if (yamlName.substr(yamlName.lastIndexOf('.') + 1).toLowerCase() === 'yaml') {
                url = '/plans/path/' + yamlName;
            } else {
                url = yamlName;
            }

            $http.get(url)
                .success(function(data) {
                    _parseResult(data);
                    resultsArr[yamlName] = data;
                    responseCount++;

                    if (resultsArr[yamlName].definitions.imports !== undefined && resultsArr[yamlName].definitions.imports.length > 0) {
                        _loadImports(resultsArr[yamlName].definitions.imports);
                    }
                    if (_isLoadingDone()) {
                        callbackFunc();
                    }
                });
        };

        this.getJson = function() {
            return json;
        };

        function _loadYaml( obj, _import ){
            obj.loadYaml(_import);
        }

        function _loadYamlTimeout( obj, _import){
            setTimeout( function(){ _loadYaml(obj,_import); },1);
        }

        function _loadImports(imports) {
            for(var i = 0; i < imports.length; i++) {
                var importName = imports[i];
                // erez - turns out that if we don't do it very complicated, angular throws a "$digest already in progress" error.
                _loadYamlTimeout( that, importName);
            }
        }

        function _isLoadingDone() {
            return responseCount === requestCount;
        }

        function _parseResult(result) {
            if (result.definitions.imports !== undefined) {
                for (var key in result.definitions.imports) {
                    if ($.inArray(key, parsedData.imports === -1)) {
                        parsedData.imports.push(result.definitions.imports[key]);
                    }
                }
            }

            if (result.definitions.types !== undefined) {
                for (var type in result.definitions.types) {
                    if ($.inArray(type, parsedData.types === -1)) {
                        var typeArr = [];
                        typeArr.push(type);
                        if (result.definitions.types[type].derived_from !== undefined) {
                            typeArr.push(result.definitions.types[type].derived_from);
                        }
                        parsedData.types.push(typeArr);
                    }
                }
            }

            if (result.definitions.service_templates !== undefined) {
                for (var template in result.definitions.service_templates) {
                    var topology = _findObjectByName(result.definitions.service_templates[template], 'topology');

                    if (parsedData.serviceTemplates.length > 0) {
                        parsedData.serviceTemplates.concat(_createNodes(topology));
                    } else {
                        parsedData.serviceTemplates = _createNodes(topology);
                    }
                }
            }

            _generateJSON();
        }

        function _findObjectByName(obj, name) {
            for(var i in obj) {
                if (i === name) {
                    return obj[i];
                }
            }
        }

        function _createNodes(topology) {
            var nodesArr = [];

            for (var node in topology) {
                nodesArr.push({
                    id: nodeId,
                    name: node,
                    types: [topology[node].type]
                });

                for (var i = 0; topology[node].relationships !== undefined && i < topology[node].relationships.length; i++) {
                    parsedData.relationships.push({
                        origin: node,
                        target: topology[node].relationships[i].target,
                        type: topology[node].relationships[i].type
                    });
                }

                nodeIdMapping[node] = nodeId;
                nodeId++;
            }

            return nodesArr;
        }

        function _createEdges(nodes) {
            var edgesArr = [];

            for (var i = 0; i < nodes.length; i++) {
                edgesArr.push({
                    type: nodes[i].type.substr(nodes[i].type.lastIndexOf('.') + 1),
                    source: nodeIdMapping[nodes[i].origin],
                    target: nodeIdMapping[nodes[i].target]
                });
            }

            return edgesArr;
        }

        function _generateJSON() {
            json = {};
            json.nodes = _updateTypes(parsedData.serviceTemplates);
            json.edges = _createEdges(parsedData.relationships);
        }

        function _updateTypes(templates) {
            var updatedArr = templates;

            for (var i = 0; i < updatedArr.length; i++) {
                for (var j = 0; j < parsedData.types.length; j++) {
                    if ($.inArray(updatedArr[i].types[0], parsedData.types[j]) > -1) {
                        updatedArr[i].types = parsedData.types[j];
                    }
                }
            }

            return updatedArr;
        }
    });