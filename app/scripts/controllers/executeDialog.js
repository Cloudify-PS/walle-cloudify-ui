'use strict';

angular.module('cosmoUiApp')
    .controller('ExecuteDialogCtrl', function ($scope, CloudifyService) {
        $scope.showError = false;
        $scope.executeErrorMessage = 'Error executing workflow';
        $scope.inputs = {};
        $scope.inputsState = 'params';
        var RAW = 'raw';

        $scope.isExecuteEnabled = function() {
            // if error message is shown, execute button should be disabled
            if ($scope.selectedWorkflow.data === null || $scope.showError) {
                return false;
            }
            for (var input in $scope.inputs) {
                // if any of the inputs value is null, the execute button should be disabled
                if ($scope.inputs[input] === null) {
                    return false;
                }
            }
            return true;
        };

        $scope.updateInputs = function() {
            if ($scope.inputsState === RAW) {
                _updateRAW();
            } else {
                _updateForm();
            }
        };

        function _updateRAW() {
            // if error message is shown & json is invalid, stop raw JSON update process until JSON is fixed & valid.
            if ($scope.showError && !_validateJSON()) {
                return;
            } else {
                $scope.showError = false;
            }

            for (var input in $scope.inputs) {
                // if any of the inputs is empty or null, set its value to null
                if ($scope.inputs[input] === '' || $scope.inputs[input] === null) {
                    $scope.inputs[input] = null;
                }
                // try to parse input value. if parse fails, keep the input value as it is.
                _parseInputs();
            }
            $scope.rawString = JSON.stringify($scope.inputs, null, 2);
        }

        $scope.$watch('inputsState', function() {
            if (!!$scope.selectedWorkflow && !!$scope.selectedWorkflow.data) {
                $scope.updateInputs();
            }
        });

        // watching the raw json string changes, validating json on every change
        $scope.$watch('rawString', function() {
            if ($scope.rawString !== undefined) {
                if (!_validateJSON()) {
                    $scope.showError = true;
                } else {
                    $scope.showError = false;
                }
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
            // parse inputs so "true" string will become boolean etc.
            _parseInputs();
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
            $scope.rawString = JSON.stringify($scope.inputs, null, 2);
        }

        function _updateForm() {
            try {
                $scope.inputs = JSON.parse($scope.rawString);
                for (var _parsedInput in $scope.inputs) {
                    // if the input type is string or object, stringifying it (for object, to prevent [object, object] value)
                    if (typeof($scope.inputs[_parsedInput]) === 'string' || typeof($scope.inputs[_parsedInput]) === 'object') {
                        $scope.inputs[_parsedInput] = JSON.stringify($scope.inputs[_parsedInput]);
                    }
                }
                $scope.showError = false;
                for (var param in $scope.selectedWorkflow.data.parameters) {
                    // if the input value was set to empty or null in the raw json, convert it to empty string for the inputs form
                    if ($scope.inputs[param] === undefined || $scope.inputs[param] === '' || $scope.inputs[param] === 'null') {
                        $scope.inputs[param] = '';
                    }
                }
            } catch (e) {
                $scope.inputsState = RAW;
                $scope.showError = true;
                $scope.executeErrorMessage = 'Invalid JSON: ' + e.message;
            }
        }

        // JSON validation by parsing it
        function _validateJSON() {
            try {
                JSON.parse($scope.rawString);
                $scope.executeErrorMessage = 'Invalid JSON: ' + e.message;
                return _validateJsonKeys();
            } catch (e) {
                return  false;
            }
        }

        // JSON keys validation, verifying all expected keys exists in JSON
        function _validateJsonKeys() {
            var _json = JSON.parse($scope.rawString);
            for (var i in $scope.inputs) {
                if (_json[i] === undefined) {
                    $scope.executeErrorMessage = 'Missing '  + i +  ' key in JSON';
                    return false;
                }
            }
            return true;
        }

        function _parseInputs() {
            for (var input in $scope.inputs) {
                try {
                    $scope.inputs[input] = JSON.parse($scope.inputs[input]);
                } catch(e) {
                    $scope.inputs[input] = $scope.inputs[input];
                }
            }
        }

        function _resetDialog() {
            $scope.workflow_id = null;
            $scope.showError = false;
            $scope.inputs = {};
            $scope.inputsState = 'params';
        }
    });
