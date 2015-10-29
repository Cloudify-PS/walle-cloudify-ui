'use strict';

// TODO: there's a lot of copy paste here from BlueprintTopology
angular.module('cosmoUiApp')
    .controller('DeploymentTopologyCtrl', function ($scope, $rootScope, $routeParams, cloudifyClient ) {

        $scope.page = {};
        $scope.deploymentId = $routeParams.deploymentId;
        $scope.showDeploymentEvents = true;

        cloudifyClient.deployments.get($scope.deploymentId, 'blueprint_id').then(function( result ){
            $scope.blueprintId = result.data.blueprint_id;
        });

        $scope.showNode = function(node){
            node.nodeType = 'node';
            $scope.page.viewNode = node;
        };


    });
