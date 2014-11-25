'use strict';

angular.module('cosmoUiApp')
    .controller('ExecuteDialogCtrl', function ($scope, CloudifyService) {
        $scope.showError = false;
        $scope.executeErrorMessage = 'Error executing workflow';
        $scope.inputs = {};
        $scope.rawString = '';
        $scope.inputsState = 'params';
        var RAW = 'raw';

        $scope.isExecuteEnabled = function() {
            if ($scope.selectedWorkflow.data === null || $scope.showError) {
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
                for (var input in $scope.inputs) {
                    if ($scope.showError && !_validateJSON()) {
                        return;
                    } else {
                        $scope.showError = false;
                    }

                    if ($scope.inputs[input] === '' || $scope.inputs[input] === 'null') {
                        $scope.inputs[input] = null;
                    }
                    try {
                        $scope.inputs[input] = JSON.parse($scope.inputs[input]);
                    } catch(e) {
                        $scope.inputs[input] = $scope.inputs[input];
                    }
                }
                $scope.rawString = JSON.stringify($scope.inputs, undefined, 2);
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
                    for (var param in $scope.selectedWorkflow.data.parameters) {
                        if ($scope.inputs[param] === undefined || $scope.inputs[param] === '' || $scope.inputs[param] === 'null') {
                            $scope.inputs[param] = '';
                        }
                    }
                } catch (e) {
                    $scope.inputsState = RAW;
                    $scope.showError = true;
                    $scope.executeErrorMessage = 'Invalid JSON';
                }
            }
        };

        $scope.$watch('inputsState', function() {
            if (!!$scope.selectedWorkflow && !!$scope.selectedWorkflow.data) {
                $scope.updateInputs();
            }
        });

        $scope.$watch('rawString', function() {
            if (!_validateJSON() && $scope.rawString.length > 0) {
                $scope.showError = true;
                $scope.executeErrorMessage = 'Invalid JSON';
            } else {
                $scope.showError = false;
            }
        });

        $scope.isParamsVisible = function() {
            var _visible = false;

            if ($scope.selectedWorkflow.data !== null) {
                if ($scope.selectedWorkflow.data.parameters !== undefined && Object.getOwnPropertyNames($scope.selectedWorkflow.data.parameters).length > 0) {
                    _visible = true;
                }
            }

            return _visible;
        };

        $scope.executeWorkflow = function() {
            for (var input in $scope.inputs) {
                if ($scope.inputs[input] === '') {
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
                deployment_id: $scope.selectedWorkflow.data.deployment,
                workflow_id: $scope.selectedWorkflow.data.value,
                inputs: $scope.inputs
            };

            if ($scope.isExecuteEnabled()) {
                $scope.inProcess = true;
                CloudifyService.deployments.execute(params)
                    .then(function(data) {
                        $scope.inProcess = false;
                        if(data.hasOwnProperty('message')) {
                            $scope.executeErrorMessage = data.message;
                            $scope.showError = true;
                        } else {
                            $scope.closeDialog();
                        }
                    });
            }
        };

        $scope.cancelWorkflow = function(executedData) {
            var callParams = {
                'execution_id': executedData.id,
                'state': 'cancel'
            };
            CloudifyService.deployments.updateExecutionState(callParams).then(function (data) {
                if (data.hasOwnProperty('error_code')) {
                    $scope.showError = true;
                    $scope.executeErrorMessage = data.message;
                }
                else {
                    $scope.closeDialog();
                }
            });
        };

        $scope.closeDialog = function() {
            $scope.toggleConfirmationDialog();
        };

        $scope.toggleInputsState = function(state) {
            $scope.inputsState = state;
        };

        $scope.isInputText = function(node) {
            var _type = 'text';
            if (node.default) {
                if ((typeof(node.default) === 'array' && node.default.length > 0)) {
                    _type = 'array';
                }
            }
            return _type === 'text';
        };

        $scope.$watch('selectedWorkflow.data', function (data) {
            if (data && data !== null) {
                _resetDialog();
                setInputs();
            }
        });

        function setInputs() {
            for(var param in $scope.selectedWorkflow.data.parameters) {
                if (param) {
                    var _defaultVal = $scope.selectedWorkflow.data.parameters[param].default;
                    var _valStr = JSON.stringify(_defaultVal);

                    if (_defaultVal !== undefined && _valStr !== '{}' && _valStr !== '' && _valStr !== '[]') {
                        $scope.inputs[param] = _defaultVal;
                    } else if (typeof($scope.selectedWorkflow.data.parameters[param]) === 'array' && $scope.selectedWorkflow.data.parameters[param].length > 0) {
                        $scope.inputs[param] = $scope.selectedWorkflow.data.parameters[param];
                    } else {
                        $scope.inputs[param] = null;
                    }
                }
            }
        }

        function _validateJSON() {
            try {
                JSON.parse($scope.rawString);
                return _validateJsonKeys();
            } catch (e) {
                return  false;
            }
        }

        function _validateJsonKeys() {
            try {
                var _json = JSON.parse($scope.rawString);
                for (var i in $scope.inputs) {
                    if (_json[i] === undefined) {
                        return false;
                    }
                }
                return true;
            } catch (e) {
                return false;
            }
        }

        function _resetDialog() {
            $scope.workflow_id = null;
            $scope.showError = false;
            $scope.inputs = {};
            $scope.inputsState = 'params';
        }
    });
