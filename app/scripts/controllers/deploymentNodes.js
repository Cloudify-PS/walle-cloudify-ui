'use strict';

/**
 * @ngdoc function
 * @name cosmoUiAppApp.controller:DeploymentNodesCtrl
 * @description
 * # DeploymentnodesCtrl
 * Controller of the cosmoUiAppApp
 */
angular.module('cosmoUiApp')
    .controller('DeploymentNodesCtrl', function ($scope, $routeParams, NodeService) {

        $scope.deploymentId = $routeParams.deploymentId;

        $scope.$on('nodesList', function(e, nodesList){
            NodeService.createNodesTree(nodesList);
            $scope.dataTable = nodesList;
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

        $scope.viewNodeDetails = function (viewNode) {
            $scope.viewNode = viewNode;
        };

    });
