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
        };//_getProperties;
        this.getPolicies = function (node) {
            return node.policies;
        };// _getPolicies;
        this.addType = _addType;
        this.getNodes = _getNodesList;
        this.getTypes = _getTypesList;
        this.getGeneralInfo = function (node) {
            var result = {
                'name': node.id,
                'type': node.type,
//                'numOfInstances':'',
//                'description':'',
                'relationships': node.relationships
            };
            return result;
        };//_getGeneralInfo;
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

    var result = {};

    this.edgesToAngular = function (data) {
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

});