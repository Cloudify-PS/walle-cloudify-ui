'use strict';

/**
 * @ngdoc function
 * @name cosmoUiAppApp.controller:BlueprintNodesCtrl
 * @description
 * # BlueprintnodesCtrl
 * Controller of the cosmoUiAppApp
 */
angular.module('cosmoUiApp')
    .controller('BlueprintNodesCtrl', function ($scope, $stateParams, NodeService, cloudifyClient) {


        $scope.blueprintId = $stateParams.blueprintId;
        $scope.page = {};

        cloudifyClient.blueprints.get($scope.blueprintId, 'plan').then(function (result) {
            var nodes = result.data.plan.nodes;
            NodeService.createNodesTree(nodes);
            NodeService.assignNodesGroups(nodes, result.data.plan.groups);
            $scope.dataTable = nodes;
        });

        $scope.getRelationshipByType = function (node, type) {
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

        $scope.getNodeById = function (node_id) {
            var _node = {};
            $scope.dataTable.forEach(function (node) {
                if (node.id === node_id) {
                    _node = node;
                }
            });
            return _node;
        };

        $scope.viewNode = function (viewNode) {
            $scope.page.viewNodeDetails = viewNode;
        };

    });
