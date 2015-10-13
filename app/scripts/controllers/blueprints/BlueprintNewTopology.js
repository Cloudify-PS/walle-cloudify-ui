'use strict';

/**
 * @ngdoc function
 * @name cosmoUiApp.controller:NewTopologyCtrl
 * @description
 * # NewTopologyCtrl
 * Controller of the cosmoUiApp
 */
angular.module('cosmoUiApp')
    .controller('BlueprintNewTopologyCtrl', function ($scope, cloudifyClient, $routeParams, DataProcessingService) {
        var blueprintId = $routeParams.blueprintId;

        $scope.topologyLoading = true;
        if ( blueprintId ) {
            cloudifyClient.blueprints.get(blueprintId).then(function (result) {
                console.log('hello world', result.data);

                var data = result.data;

                var topologyData = {
                    data: data,
                    networkBarLocation: 316,
                    scale: 0.75,
                    offset: [0, 29]
                };

                $scope.topologyData = DataProcessingService.encodeTopologyFromRest(topologyData);
                $scope.topologyLoading = false;
            });
        }
    });
