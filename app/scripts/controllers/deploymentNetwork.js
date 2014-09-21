'use strict';

/**
 * @ngdoc function
 * @name cosmoUiAppApp.controller:DeploymentNetworkCtrl
 * @description
 * # DeploymentnetworkCtrl
 * Controller of the cosmoUiApp
 */
angular.module('cosmoUiApp')
    .controller('DeploymentNetworkCtrl', function ($scope, $routeParams, $timeout, RestService, bpNetworkService, NetworksService) {

        $scope.deploymentId = $routeParams.deploymentId;

        var nodes = [];

        $scope.$on('nodesList', function(e, nodesList){
            nodes = nodesList;
        });

        RestService.getProviderContext()
            .then(function(providerData) {
                $scope.networks = NetworksService.createNetworkTree(providerData, nodes);

                bpNetworkService.setMap($scope.networks.relations);
                $timeout(function(){
                    $scope.networkcoords = bpNetworkService.getCoordinates();
                    bpNetworkService.render();
                }, 100);
            });

        $scope.viewNodeDetails = function (viewNode) {
            $scope.viewNode = viewNode;
        };

    });
