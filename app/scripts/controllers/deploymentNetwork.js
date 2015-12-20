'use strict';

/**
 * @ngdoc function
 * @name cosmoUiAppApp.controller:DeploymentNetworkCtrl
 * @description
 * # DeploymentnetworkCtrl
 * Controller of the cosmoUiApp
 */
angular.module('cosmoUiApp')
    .controller('DeploymentNetworkCtrl', function ($scope, $stateParams, $timeout, cloudifyClient, bpNetworkService, NetworksService, $q) {

        $scope.deploymentId = $stateParams.deploymentId;
        $scope.page = {};


        var blueprintPromise = cloudifyClient.deployments.get($scope.deploymentId, 'blueprint_id').then(function(result){
            return cloudifyClient.blueprints.get(result.data.blueprint_id).then(function( result ){
                $scope.blueprint =  result.data;
            });
        });

        $q.all([blueprintPromise, cloudifyClient.manager.get_context()]).then(function (results) {
            var result = results[1];
            var providerData = result.data;
            $scope.networks = NetworksService.createNetworkTree(providerData, $scope.blueprint.plan.nodes);

            bpNetworkService.setMap($scope.networks.relations);
            $scope.networkcoords = bpNetworkService.getCoordinates();
            //bpNetworkService.render();
        });


        $scope.viewNodeDetails = function (viewNode) {
            $scope.page.viewNode = viewNode;
        };

    });
