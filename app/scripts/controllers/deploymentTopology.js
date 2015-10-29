'use strict';

// TODO: there's a lot of copy paste here from BlueprintTopology
angular.module('cosmoUiApp')
    .controller('DeploymentTopologyCtrl', function ($scope, $rootScope, $routeParams, NodeService, blueprintCoordinateService, cloudifyClient ) {

        $scope.page = {};
        $scope.deploymentId = $routeParams.deploymentId;
        $scope.showDeploymentEvents = true;

        var nodes = null;

        cloudifyClient.deployments.get($scope.deploymentId, 'blueprint_id').then(function( result ){
            $scope.blueprintId = result.data.blueprint_id;
            cloudifyClient.blueprints.get($scope.blueprintId).then(function( result ){
                $scope.blueprint = result.data;
                var nodes = result.data.plan.nodes;
            })
        });


        $scope.showNode = function(node){
            node.nodeType = 'node';
            $scope.page.viewNode = _.find(nodes, {id:node.id});
        };

        $scope.showRelationship = function( relationship ){
            relationship.nodeType = 'relationship';
            $scope.page.viewNode = relationship;
        };

    });
