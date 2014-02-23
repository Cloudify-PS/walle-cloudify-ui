'use strict';

angular.module('cosmoUi')
    .controller('DeployDialogCtrl', function ($scope, RestService) {
        $scope.deploymentId = null;

        $scope.isDeployEnabled = function() {
            return $scope.deploymentId !== null && $scope.deploymentId.length > 0;
        };

        $scope.deployBlueprint = function(blueprint) {
            var params = {
                blueprintId: blueprint.id,
                deploymentId: $scope.deploymentId
            }

            if ($scope.isDeployEnabled()) {
                RestService.deployBlueprint(params)
                    .then(function() {
                        $scope.redirectToDeployments(blueprint);
                    });
            }
        };
    });
