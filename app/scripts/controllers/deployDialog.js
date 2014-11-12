'use strict';

angular.module('cosmoUiApp')
    .controller('DeployDialogCtrl', function ($scope, CloudifyService) {
        $scope.deployment_id = null;
        $scope.deployError = false;
        $scope.deployErrorMessage = 'Error deploying blueprint';
        $scope.inputs = {};
        $scope.inputsState = 'params';
        $scope.rawString = '';

        $scope.isDeployEnabled = function () {
            if ($scope.selectedBlueprint === null || $scope.selectedBlueprint === undefined) {
                return false;
            }
            var _enabled = true;

            $scope.updateInputs();

            for (var input in $scope.inputs) {
                if ($scope.inputs[input] === '' || $scope.inputs[input] === null) {
                    _enabled = false;
                }
            }

            if ($scope.deployment_id === null) {
                _enabled = false;
            }
            return _enabled;
        };

        $scope.updateInputs = function() {
            if ($scope.inputsState === 'raw') {
                if ($scope.rawString === '') {
                    $scope.rawString = JSON.stringify($scope.inputs, undefined, 2);
                } else {
                    var _rawJSON = JSON.parse($scope.rawString);
                    for (var input in _rawJSON) {
                        $scope.inputs[input] = _rawJSON[input];
                    }
                }
            } else {
                for (var input in $scope.selectedBlueprint.plan.inputs) {
                    if ($scope.inputs[input] === undefined || $scope.inputs[input] === '') {
                        $scope.inputs[input] = '';
                    }
                }
                $scope.rawString = JSON.stringify($scope.inputs, undefined, 2);
            }
        };

        $scope.isParamsVisible = function () {
            if ($scope.selectedBlueprint === null) {
                return;
            }
            return Object.getOwnPropertyNames($scope.selectedBlueprint.plan.inputs).length > 0;
        };

        $scope.deployBlueprint = function (blueprintId) {
            if (!_validateDeploymentName($scope.deployment_id)) {
                return;
            }
            $scope.deployError = false;

            if ($scope.inputsState === 'raw') {
                try {
                    $scope.inputs = JSON.parse($scope.rawString);
                } catch (e) {
                }
            }

            var params = {
                blueprint_id: blueprintId,
                deployment_id: $scope.deployment_id,
                inputs: $scope.inputs
            };

            if ($scope.isDeployEnabled()) {
                $scope.inProcess = true;
                CloudifyService.blueprints.deploy(params)
                    .then(function (data) {
                        $scope.inProcess = false;
                        if (data.hasOwnProperty('message')) {
                            $scope.deployErrorMessage = data.message;
                            $scope.deployError = true;
                        }
                        else {
                            $scope.redirectToDeployment($scope.deployment_id);
                        }
                    });
            }
        };

        $scope.isDeployError = function () {
            return $scope.deployError;
        };

        $scope.closeDialog = function () {
            _resetDialog();
            $scope.toggleDeployDialog();
        };

        $scope.toggleInputsState = function (state) {
            $scope.inputsState = state;
        };

        $scope.$watch('selectedBlueprint', function (selectedBlueprint) {
            if (selectedBlueprint && selectedBlueprint.hasOwnProperty('plan')) {
                for (var name in selectedBlueprint.plan.inputs) {
                    var planInput = selectedBlueprint.plan.inputs[name];
                    if (planInput.hasOwnProperty('default')) {
                        $scope.inputs[name] = planInput.default;
                    }
                }
                $scope.rawString = JSON.stringify($scope.inputs, undefined, 2);
            }
        }, true);

        // Temporary solution - should be handled by Cosmo, not UI side
        function _validateDeploymentName(deploymentName) {
            if (/[^a-zA-Z0-9_]/.test(deploymentName)) {
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
            $scope.inputsState = 'params';
        }

        _resetDialog();
    });
