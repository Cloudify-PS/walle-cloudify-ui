'use strict';

/**
 * @ngdoc function
 * @name cosmoUiAppApp.controller:BlueprintNodesCtrl
 * @description
 * # BlueprintnodesCtrl
 * Controller of the cosmoUiAppApp
 */
angular.module('cosmoUiApp')
    .controller('BlueprintNodesCtrl', function ($scope, $routeParams, NodeService) {

        $scope.blueprintId = $routeParams.blueprintId;

        $scope.$on('blueprintData', function(event, data){
            NodeService.createNodesTree(data.plan.nodes);
            $scope.dataTable = data.plan.nodes;

        });

        $scope.getRelationshipByType = function(node, type) {
            var relationshipData = [];
            if (node.relationships !== undefined) {
                for (var i = 0; i < node.relationships.length; i++) {
                    if (node.relationships[i].type_hierarchy.join(',').indexOf(type) > -1) {
                        relationshipData.push(node.relationships[i]);
                    }
                }
            }
            return relationshipData;
        };

        $scope.getNodeById = function(node_id) {
            var _node = {};
            $scope.dataTable.forEach(function(node) {
                if (node.id === node_id) {
                    _node = node;
                }
            });
            return _node;
        };

        $scope.viewNode = function (viewNode) {
            $scope.viewNodeDetails = viewNode;
        };

    });
