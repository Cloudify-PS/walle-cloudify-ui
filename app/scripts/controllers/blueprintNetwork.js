'use strict';

/**
 * @ngdoc function
 * @name cosmoUiAppApp.controller:BlueprintNetworkCtrl
 * @description
 * # BlueprintnetworkCtrl
 * Controller of the cosmoUiAppApp
 */
angular.module('cosmoUiApp')
    .controller('BlueprintNetworkCtrl', function ($scope, $routeParams, cloudifyClient, bpNetworkService, NetworksService, $q ) {

        $scope.blueprintId = $routeParams.blueprintId;
        $scope.networks = [];
        $scope.page = {};

        var blueprintPromise = cloudifyClient.blueprints.get($scope.blueprintId).then(function (result) {
            $scope.blueprint = result.data;
        });


        $q.all([blueprintPromise, cloudifyClient.manager.get_context()])
            .then(function(results) {

                var result = results[1];

                var providerData = result.data;
                $scope.networks = NetworksService.createNetworkTree(providerData, $scope.blueprint.plan.nodes);
                bpNetworkService.setMap($scope.networks.relations);
                $scope.networkcoords = bpNetworkService.getCoordinates();
            });

        $scope.viewNodeDetails = function (viewNode) {
            $scope.page.viewNode = viewNode;
        };

    });
