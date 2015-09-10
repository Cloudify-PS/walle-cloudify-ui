'use strict';

/**
 * @ngdoc function
 * @name cosmoUiAppApp.controller:DeploymentNetworkCtrl
 * @description
 * # DeploymentnetworkCtrl
 * Controller of the cosmoUiApp
 */
angular.module('cosmoUiApp')
    .controller('DeploymentNetworkCtrl', function ($scope, $routeParams, $timeout, cloudifyClient, bpNetworkService, NetworksService) {

        $scope.deploymentId = $routeParams.deploymentId;
        $scope.page = {};

        $scope.$on('nodesList', function(e, nodesList){
            cloudifyClient.manager.get_context()
                .then(function(result) {
                    var providerData = result.data;
                    $scope.networks = NetworksService.createNetworkTree(providerData, nodesList);

                    bpNetworkService.setMap($scope.networks.relations);
                    $timeout(function(){
                        $scope.networkcoords = bpNetworkService.getCoordinates();
                        bpNetworkService.render();
                    }, 100);
                });
        });



        $scope.viewNodeDetails = function (viewNode) {
            $scope.page.viewNode = viewNode;
        };

    });
