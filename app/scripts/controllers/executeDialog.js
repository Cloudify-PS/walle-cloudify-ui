'use strict';

angular.module('cosmoUiApp')
    .controller('ExecuteDialogCtrl', function ($scope, CloudifyService) {
        $scope.executeError = false;
        $scope.executeErrorMessage = 'Error executing workflow';
        $scope.inputs = {};
        $scope.rawString = '';
        $scope.inputsState = 'params';

        $scope.isExecuteEnabled = function() {
            if ($scope.selectedWorkflow.data === null) {
                return;
            }

            var _enabled = true;

            $scope.updateInputs();

            for (var input in $scope.inputs) {
                if ($scope.inputs[input] === '' || $scope.inputs[input] === null) {
                    _enabled = false;
                }
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
                for (var param in $scope.selectedWorkflow.data.parameters) {
                    if ($scope.inputs[param] === undefined || $scope.inputs[param] === '') {
                        $scope.inputs[param] = '';
                    }
                }
                $scope.rawString = JSON.stringify($scope.inputs, undefined, 2);
            }
        };

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
            $scope.executeError = false;

            if ($scope.inputsState === 'raw') {
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
                            $scope.executeError = true;
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
                    $scope.executeError = true;
                    $scope.executeErrorMessage = data.message;
                }
                else {
                    $scope.closeDialog();
                }
            });
        };

        $scope.isExecuteError = function() {
            return $scope.executeError;
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
                        $scope.inputs[param] = _defaultVal.toString();
                    } else if (typeof($scope.selectedWorkflow.data.parameters[param]) === 'array' && $scope.selectedWorkflow.data.parameters[param].length > 0) {
                        $scope.inputs[param] = $scope.selectedWorkflow.data.parameters[param];
                    }
                }
            }
        }

        function _resetDialog() {
            $scope.workflow_id = null;
            $scope.executeError = false;
            $scope.inputs = {};
            $scope.inputsState = 'params';
        }
    });
