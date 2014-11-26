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
            if (!$scope.selectedBlueprint || !$scope.deployment_id || $scope.showError) {
                return false;
            }
            for (var input in $scope.inputs) {
                if ($scope.inputs[input] === null) {
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
                    if ($scope.inputs[input] === '' || $scope.inputs[input] === null) {
                        $scope.inputs[input] = null;
                    }
                    try {
                        $scope.inputs[input] = JSON.parse($scope.inputs[input]);
                    } catch(e) {
                        $scope.inputs[input] = $scope.inputs[input];
                    }
                }
                $scope.rawString = JSON.stringify($scope.inputs, null, 2);
                var _rawJSON = JSON.parse($scope.rawString);
                for (var rawInput in _rawJSON) {
                    $scope.inputs[input] = _rawJSON[rawInput];
                }
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
                        if ($scope.inputs[_input] === undefined || $scope.inputs[_input] === '' || $scope.inputs[_input] === 'null') {
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

        $scope.$watch('rawString', function() {
            if (!_validateJSON() && $scope.rawString.length > 0) {
                $scope.showError = true;
            } else {
                $scope.showError = false;
                if ($scope.selectedBlueprint && $scope.deployment_id) {
                    return false;
                }
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
                if ($scope.inputs[input] === '' || $scope.inputs[input] === 'null') {
                    $scope.inputs[input] = '""';
                }
                try {
                    $scope.inputs[input] = JSON.parse($scope.inputs[input]);
                } catch(e) {
                    $scope.inputs[input] = $scope.inputs[input];
                }
            }
            $scope.showError = false;

            if ($scope.inputsState === RAW) {
                try {
                    $scope.inputs = JSON.parse($scope.rawString);
                } catch (e) {}
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
                    } else {
                        $scope.inputs[name] = null;
                    }
                }
            }
        }, true);

        function _validateJSON() {
            try {
                JSON.parse($scope.rawString);
                return _validateJsonKeys();
            } catch (e) {
                $scope.deployErrorMessage = 'Invalid JSON';
                return false;
            }
        }

        function _validateJsonKeys() {
            try {
                var _json = JSON.parse($scope.rawString);
                for (var i in $scope.inputs) {
                    if (_json[i] === undefined) {
                        $scope.deployErrorMessage = 'Missing ' + i + ' key in JSON';
                        return false;
                    }
                }
                return true;
            } catch (e) {
                return false;
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
