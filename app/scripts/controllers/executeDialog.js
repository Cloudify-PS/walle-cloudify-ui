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
            if ($scope.inputsState === 'raw') {
                $scope.rawString = JSON.stringify($scope.inputs, undefined, 2);
            } else {
                for (var param in $scope.selectedWorkflow.data.parameters) {
                    if ($scope.inputs[param] === undefined || $scope.inputs[param] === '') {
                        $scope.inputs[param] = '';
                        _enabled = false;
                    }
                }
            }
            return _enabled;
        };

        $scope.isParamsVisible = function() {
            var _visible = false;

            if ($scope.selectedWorkflow.data !== null) {
                if ($scope.selectedWorkflow.data.parameters !== undefined && Object.getOwnPropertyNames($scope.selectedWorkflow.data.parameters).length > 0) {
                    setInputs();
                    _visible = true;
                }
            }

            return _visible;
        };

        function setInputs() {
            for(var param in $scope.selectedWorkflow.data.parameters) {
                if (param) {
                    var _defaultVal = $scope.selectedWorkflow.data.parameters[param].default;
                    var _valStr = JSON.stringify(_defaultVal);

                    if (_defaultVal !== undefined && _valStr !== '{}' && _valStr !== '' && _valStr !== '[]') {
                        switch(typeof(_defaultVal)) {
                            case 'array':
                            case 'object':
                                $scope.inputs[param] = _valStr;
                                break;
                            default:
                                $scope.inputs[param] = _defaultVal;
                        }
                    } else if (typeof($scope.selectedWorkflow.data.parameters[param]) === 'array' && $scope.selectedWorkflow.data.parameters[param].length > 0) {
                        $scope.inputs[param] = $scope.selectedWorkflow.data.parameters[param];
                    }
                }
            }
        }

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
            _resetDialog();
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

        function _resetDialog() {
            $scope.workflow_id = null;
            $scope.executeError = false;
            $scope.inputs = {};
            $scope.inputsState = 'params';
        }

        _resetDialog();
    });
