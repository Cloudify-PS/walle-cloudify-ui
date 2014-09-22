'use strict';

angular.module('cosmoUiApp')
    .controller('DeployDialogCtrl', function ($scope, CloudifyService) {
        $scope.deployment_id = null;
        $scope.deployError = false;
        $scope.deployErrorMessage = 'Error deploying blueprint';
        $scope.inputs = {};
        $scope.inputsJSON = null;
        $scope.inputsState = 'params';

        $scope.isDeployEnabled = function() {
            return $scope.deployment_id !== null && $scope.deployment_id.length > 0;
        };

        $scope.isParamsVisible = function() {
            if ($scope.selectedBlueprint === null) {
                return;
            }
            return Object.getOwnPropertyNames($scope.selectedBlueprint.plan.inputs).length > 0;
        };

        $scope.deployBlueprint = function(blueprintId) {
            if (!_validateDeploymentName($scope.deployment_id)) {
                return;
            }
            $scope.deployError = false;

            if ($scope.inputsState === 'raw') {
                try {
                    $scope.inputs = JSON.parse($scope.inputsJSON);
                } catch (e) {}
            }

            var params = {
                blueprint_id: blueprintId,
                deployment_id: $scope.deployment_id,
                inputs: $scope.inputs
            };

            if ($scope.isDeployEnabled()) {
                $scope.inProcess = true;
                CloudifyService.bleuprints.deploy(params)
                    .then(function(data) {
                        $scope.inProcess = false;
                        if(data.hasOwnProperty('message')) {
                            $scope.deployErrorMessage = data.message;
                            $scope.deployError = true;
                        }
                        else {
                            $scope.redirectToDeployment($scope.deployment_id);
                        }
                    });
            }
        };

        $scope.isDeployError = function() {
            return $scope.deployError;
        };

        $scope.closeDialog = function() {
            _resetDialog();
            $scope.toggleDeployDialog();
        };

        $scope.toggleInputsState = function(state) {
            $scope.inputsState = state;
        };

        // Temporary solution - should be handled by Cosmo, not UI side
        function _validateDeploymentName(deploymentName) {
            if(/[^a-zA-Z0-9_]/.test(deploymentName)) {
                $scope.deployErrorMessage = 'Invalid deployment name. Only Alphanumeric text allowed.';
                $scope.deployError = true;

                return false;
            }
            return true;
        }

        function _resetDialog() {
            $scope.deployment_id = null;
            $scope.deployError = false;
            $scope.inputs = {};
            $scope.inputsJSON = null;
            $scope.inputsState = 'params';
        }

        _resetDialog();
    });
