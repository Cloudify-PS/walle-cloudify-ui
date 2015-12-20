'use strict';

/**
 * @ngdoc function
 * @name cosmoUiApp.controller:NewTopologyCtrl
 * @description
 * # NewTopologyCtrl
 * Controller of the cosmoUiApp
 */
angular.module('cosmoUiApp')
    .controller('BlueprintNewTopologyCtrl', function ($scope, cloudifyClient, $stateParams, DataProcessingService) {

        var blueprintId = $stateParams.blueprintId;

        $scope.page = {};
        $scope.page.topologyLoading = true;
        if ( blueprintId ) {
            cloudifyClient.blueprints.get(blueprintId).then(function (result) {
                var data = result.data;

                var topologyData = {
                    data: data,
                    networkBarLocation: 316,
                    scale: 0.75,
                    offset: [0, 29]
                };

                $scope.page.topologyData = DataProcessingService.encodeTopologyFromRest(topologyData);

                $scope.page.topologyLoading = false;
            });
        }
    });
