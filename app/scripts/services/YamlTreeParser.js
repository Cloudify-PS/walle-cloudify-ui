'use strict';

angular.module('cosmoUi')
    .service('YamlTreeParser', function YamlTreeParser() { });
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

