'use strict';

/**
 * @ngdoc function
 * @name cosmoUiAppApp.controller:BlueprintNetworkCtrl
 * @description
 * # BlueprintnetworkCtrl
 * Controller of the cosmoUiAppApp
 */
angular.module('cosmoUiApp')
    .controller('BlueprintNetworkCtrl', function ($scope, $routeParams, cloudifyClient, bpNetworkService, NetworksService) {

        $scope.blueprintId = $routeParams.blueprintId;
        $scope.networks = [];
        $scope.page = {};

        $scope.$on('blueprintData', function(event, data){
            cloudifyClient.manager.get_context()
                .then(function(providerData) {
                    $scope.networks = NetworksService.createNetworkTree(providerData, data.plan.nodes);
                    bpNetworkService.setMap($scope.networks.relations);
                    $scope.networkcoords = bpNetworkService.getCoordinates();
                });

        });

        $scope.viewNodeDetails = function (viewNode) {
            $scope.page.viewNode = viewNode;
        };

    });
