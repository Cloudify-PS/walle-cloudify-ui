'use strict';

angular.module('cosmoUi').service('PlanData', function () {


    // AngularJS will instantiate a singleton by calling "new" on this function

    var DERIVED_FROM = 'derived_from';
    var TYPE = 'type';
    var PROPERTIES = 'properties';
    var POLICIES = 'policies';
    var RELATIONSHIPS = 'relationships';
    /*var CONTAINED_IN = 'cloudify.relationships.contained_in';*/
    /*var CONNECTED_TO = 'cloudify.relationships.connected_to';*/
    var NAME = 'name';

    function DataWrapper() {
        var nodesMap = {}; // id to node map
        var typesMap = {}; // map between name and type

        var nodesList = []; //
        var typesList = [];

        var json = {};


        // returns node from which we inherit or NULL if cannot find one
        function _getParentType(type) {
            if (type.hasOwnProperty(DERIVED_FROM)) {
                var derivedFrom = type[DERIVED_FROM];
                if (typesMap.hasOwnProperty(derivedFrom)) {
                    return typesMap[derivedFrom];
                } else {
                    console.log(['missing type', derivedFrom ]);

                }
            }
            return null;
        }


        // returns the node's type or else null
        function _getType(node) {
            if (node.hasOwnProperty(TYPE)) {
                var typeName = node[TYPE];
                if (typesMap.hasOwnProperty(typeName)) {
                    return typesMap[typeName];
                } else {
                    console.log(['type is missing', typeName]);
                }
            } else {
                console.log(['node is missing type field', node]);
            }
            return null;
        }





        function _getMergedValuesForProperty(node, property) {
            var properties = []; // a list of properties we will later merge. 0 - leaf, N - root.
            var type = null;
            var index = 0;
            var result = {};

            if (node.hasOwnProperty(property)) {
                properties.push(node[property]);
            }

            // get all inherited properties
            type = _getType(node);
            while (type !== null) {

                if (type.hasOwnProperty(property)) {
                    properties.push(type[property]);
                }

                type = _getParentType(type);
            }

            if (properties.length === 0) {
                return null; // empty through the entire tree;
            }

            // now lets merge
            for (index = properties.length - 1; index >= 0; index--) {
                $.extend(result, properties[index]);
            }
            return result;
        }

        // returns a JSON representation of this node's properties merged with parent
        function _getProperties(node) {
            return _getMergedValuesForProperty(node, PROPERTIES);
        }

        // returns a JSON representation of this node's policies merged with parent
        function _getPolicies(node) {
            var policiesList = _getMergedValuesForProperty(node, POLICIES);
            var result = {};
            var index = 0;
            var item = null;
            var itemName = null;

            for (index in policiesList) {
                if (policiesList.hasOwnProperty(index)) {
                    item = policiesList[index];
                    item = $.extend({}, item);
                    itemName = item[ NAME ];
                    delete item[ NAME ];
                    result[itemName] = item;
                }
            }

            return result;
        }

        function _getGeneralInfo(node) { // todo: remove this. We should expose smaller getters and let controller build this structure
            var result = {
                'name': node.name,
                'type': _getTypesName(node),
//                'numOfInstances':'',
//                'description':'',
                'relationships': _getRelationships(node)
            };


            for (var i in result) {
                if (result.hasOwnProperty(i) && result[i] === null) {
                    delete result[i];
                }
            }
            return result;
        }

        function _getRelationships(node) {
            var resultAsObj = _getMergedValuesForProperty(node, RELATIONSHIPS);
            var result = [];

            for (var i in resultAsObj) {
                if (resultAsObj.hasOwnProperty(i)) {
                    result.push(resultAsObj[i]);
                }
            }

            return result;
        }

        /*function _getRelationshipsByType(node, relationshipType) {
            var relationships = _getRelationships(node);
            var result = [];
            return $(relationships).grep(function (index, item) {
                if (item.hasOwnProperty(TYPE) && item[TYPE] === relationshipType) {
                    result.push(item);
                } else {
                    console.log(['relationship is missing a type property', node, relationshipType, item]);
                }
            });
        }*/

        // returns node in which this node is contained in
//        function _getContainerNode(node) {
//
//        }

        function _getTypesName(node) {
            var result = [];
            var nodeType = null;


            nodeType = _getType(node);
            while (nodeType !== null) {
                if (nodeType.hasOwnProperty(NAME)) {
                    result.push(nodeType[NAME]);
                } else {
                    console.log(['nodeType does not have a name', node, nodeType ]);
                }
                nodeType = _getParentType(nodeType);
            }

            if (result.length === 0) {
                console.log(['node is missing type field', node]);
            }

            return result;

        }

        // returns this node's contained nodes
//        function _getContainedNodes(node) {

//        }

        // returns the nodes this node has "depends_on" relationship.
//        function _getDependencies(node) {

//        }

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
        this.getProperties = _getProperties;
        this.getPolicies = _getPolicies;
        this.addType = _addType;
        this.getNodes = _getNodesList;
        this.getTypes = _getTypesList;
        this.getGeneralInfo = _getGeneralInfo;
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
