'use strict';

angular.module('cosmoUiApp')
    .controller('BlueprintTopologyCtrl', function ($scope, $routeParams, cloudifyClient, DataProcessingService) {
        $scope.blueprintId = $routeParams.blueprintId;
        $scope.page = {};
        var nodes = null; // cache for view node




        $scope.onNodeSelected = function(node){
            // get node from variable, otherwise we get stack overflow
            $scope.viewNode(_.find(nodes,{id:node.id}));
        };


        $scope.viewNode = function (viewNode) {
            viewNode.nodeType = 'node';
            if ( viewNode && viewNode.side1 ) {
                viewNode.nodeType = nodeType;
            }

            $scope.page.viewNode = viewNode;
        };


    });
