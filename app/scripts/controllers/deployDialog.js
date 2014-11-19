'use strict';

angular.module('cosmoUiApp')
    .controller('DeployDialogCtrl', function ($scope, CloudifyService) {
        $scope.deployment_id = null;
        $scope.showError = false;
        $scope.deployErrorMessage = 'Error deploying blueprint';
        $scope.inputs = {};
        $scope.inputsState = 'params';
        $scope.rawString = '';
        var RAW = 'raw';


        $scope.isDeployEnabled = function () {
            if (!$scope.selectedBlueprint || !$scope.deployment_id) {
                return false;
            }

            for (var input in $scope.inputs) {
                if ($scope.inputs[input] === '' || $scope.inputs[input] === null) {
                    return false;
                }
            }
            return true;
        };

        $scope.updateInputs = function() {
            if ($scope.inputsState === RAW) {
                if ($scope.showError && !_validateJSON()) {
                    return;
                } else {
                    $scope.showError = false;
                }

                for (var input in $scope.inputs) {
                    if ($scope.inputs[input] === '') {
                        $scope.inputs[input] = '""';
                    }
                    $scope.inputs[input] = JSON.parse($scope.inputs[input]);
                }
                $scope.rawString = JSON.stringify($scope.inputs, null, 2);
            } else {
                try {
                    $scope.inputs = JSON.parse($scope.rawString);
                    for (var _parsedInput in $scope.inputs) {
                        if (typeof($scope.inputs[_parsedInput]) === 'string' || typeof($scope.inputs[_parsedInput]) === 'object') {
                            $scope.inputs[_parsedInput] = JSON.stringify($scope.inputs[_parsedInput]);
                        }
                    }
                    $scope.showError = false;
                    for (var _input in $scope.selectedBlueprint.plan.inputs) {
                        if ($scope.inputs[_input] === undefined || $scope.inputs[_input] === '' || $scope.inputs[_input] === '""') {
                            $scope.inputs[_input] = '';
                        }
                    }
                } catch(e) {
                    $scope.inputsState = RAW;
                    $scope.showError = true;
                    $scope.deployErrorMessage = 'Invalid JSON';
                }
            }
        };

        $scope.$watch('inputsState', function() {
            if (!!$scope.selectedBlueprint) {
                $scope.updateInputs();
            }
        });

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

            for (var input in $scope.inputs) {
                if ($scope.inputs[input] === '') {
                    $scope.inputs[input] = '""';
                }
                $scope.inputs[input] = JSON.parse($scope.inputs[input]);
            }

            $scope.showError = false;

            if ($scope.inputsState === RAW) {
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
                            $scope.showError = true;
                        }
                        else {
                            $scope.redirectToDeployment($scope.deployment_id);
                        }
                    });
            }
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
            }
        }, true);

        // Temporary solution - should be handled by Cosmo, not UI side
        function _validateDeploymentName(deploymentName) {
            if (/[^a-zA-Z0-9_]/.test(deploymentName)) {
                $scope.deployErrorMessage = 'Invalid deployment name. Only Alphanumeric text allowed.';
                $scope.showError = true;

                return false;
            }
            return true;
        }

        function _validateJSON() {
            try {
                JSON.parse($scope.rawString);
                return true;
            } catch (e) {
                return  false;
            }
        }

        function _resetDialog() {
            $scope.deployment_id = null;
            $scope.showError = false;
            $scope.inputs = {};
            $scope.inputsState = 'params';
        }

        _resetDialog();
    });
