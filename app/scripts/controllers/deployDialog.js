'use strict';

angular.module('cosmoUi')
    .controller('DeployDialogCtrl', function ($scope, RestService) {
        $scope.deploymentId = null;
        $scope.deployError = false;
        $scope.deployErrorMessage = 'Error deploying blueprint';

        $scope.isDeployEnabled = function() {
            return $scope.deploymentId !== null && $scope.deploymentId.length > 0;
        };

        $scope.deployBlueprint = function(blueprint) {
            if (!_validateDeploymentName($scope.deploymentId)) {
                return;
            }
            $scope.deployError = false;

            var params = {
                blueprintId: blueprint.id,
                deploymentId: $scope.deploymentId
            };

            if ($scope.isDeployEnabled()) {
                RestService.deployBlueprint(params)
                    .then(function() {
                        $scope.redirectToDeployments($scope.deploymentId, blueprint);
                    });
            }
        };

        $scope.isDeployError = function() {
            return $scope.deployError;
        };

        $scope.closeDialog = function() {
            $scope.toggleDeployDialog();
        };

        // Temporary solution - should be handled by Cosmo, not UI side
        function _validateDeploymentName(deploymentName) {
            if(/[^a-zA-Z0-9]/.test(deploymentName)) {
                $scope.deployErrorMessage = 'Invalid deployment name. Only Alphanumeric text allowed.';
                $scope.deployError = true;

                return false;
            }
            return true;
        }
    });
