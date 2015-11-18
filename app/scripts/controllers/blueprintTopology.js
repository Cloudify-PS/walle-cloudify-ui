'use strict';

angular.module('cosmoUiApp')
    .controller('BlueprintTopologyCtrl', function ($scope, $routeParams) {
        $scope.blueprintId = $routeParams.blueprintId;
        $scope.page = {};

        $scope.onNodeSelect = function(node){
            $scope.viewNode(node,'node');
        };

        $scope.onRelationshipSelect = function( relationship ){
            $scope.viewNode(relationship, 'relationship');
        };

        $scope.viewNode = function (viewNode, nodeType) {
            viewNode.nodeType = nodeType;
            $scope.page.viewNode = viewNode;
        };


    });
