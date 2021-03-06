'use strict';

/**
 * @ngdoc function
 * @name cosmoUiAppApp.controller:DeploymentNodesCtrl
 * @description
 * # DeploymentnodesCtrl
 * Controller of the cosmoUiAppApp
 */
angular.module('cosmoUiApp')
    .controller('DeploymentNodesCtrl', function ($scope, $stateParams, NodeService, cloudifyClient, $log) {

        $scope.deploymentId = $stateParams.deploymentId;
        $scope.page = {};

        cloudifyClient.nodes.list($scope.deploymentId)
            .then(function (httpResponse) {
                var nodes = httpResponse.data.items;
                //TODO: This function is changing the Model directly! We should not allow this! CFY-3798
                NodeService.createNodesTree(nodes);
                $scope.dataTable = nodes;
                cloudifyClient.deployments.get($scope.deploymentId)
                    .then(function (httpResponse) {
                        NodeService.assignNodesGroups(nodes, httpResponse.data.groups);
                    }, function (httpResponse) {
                        $log.error(httpResponse);
                    });
            }, function (httpResponse) {
                $log.error(httpResponse);
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

        $scope.viewNodeDetails = function (viewNode) {
            $scope.page.viewNode = viewNode;
        };

    });
