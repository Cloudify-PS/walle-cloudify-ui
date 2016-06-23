'use strict';

/**
 *
 * @ngdoc directive
 * @name cosmoUiApp.directive:formRawParams
 * @description
 * # formRawParams
 * acts as a form field that combines multiple form fields. exposes several display options: as raw or json
 *
 * @property {object} params - either blueprint inputs or workflow parameters directly from source. READ ONLY
 * @property {function} onError - should handle errors such as invalid json
 * @property {boolean} valid - keeps valid state of this form field
 *
 */
angular.module('cosmoUiApp')
    .directive('formRawParams', function ($filter) {
        return {
            templateUrl: 'views/directives/formRawParams.html',
            restrict: 'A',
            scope: {
                'sendErrorMessage': '&onError',
                'params': '=',
                'rawString': '=',
                'valid': '='
            },
            link: function postLink($scope/*, $element, $attrs*/) {
                var sendErrorMessage = $scope.sendErrorMessage.call(this, {msg: arguments});

                $scope.inputsState = 'form';
                $scope.inputs = {};

                function isValid() {
                    return _validateJSON(false) && _validateInputsNotEmpty();
                }

                // JSON keys validation, verifying all expected keys exists in JSON
                // if key is missing we want to display an error
                // if additional key is added and unexpected we want to display an error
                function _validateJsonKeys() {
                    var _json = $scope.rawString ? JSON.parse($scope.rawString) : {};

                    for (var key_expected in $scope.params) {
                        if (_json[key_expected] === undefined) {
                            sendErrorMessage($filter('translate')('formRawParams.missingKeyInJson', {key: key_expected}));
                            return false;
                        }
                    }
                    for (var key_present in _json) {
                        if (!$scope.params.hasOwnProperty(key_present)) {
                            sendErrorMessage($filter('translate')('formRawParams.unexpectedKeyInJson', {key: key_present}));
                            return false;
                        }
                    }
                    return true;
                }

                // JSON validation by parsing it
                function _validateJSON(skipKeys) {
                    if ($scope.rawString === undefined) {
                        return false; // fail silently. we don't care about undefined. in this scenario. don't alert invalid json.
                    }

                    try {
                        window.jsonlint.parse($scope.rawString);
                        return skipKeys || _validateJsonKeys();
                    } catch (e) {
                        sendErrorMessage(e.message.split('\n').reduce(function (result, chunk) {
                            return result + '<div>' + chunk + '</div>';
                        }, ''));
                        return false;
                    }
                }

                // check if there are no empty inputs
                function _validateInputsNotEmpty() {
                    try {
                        var parsedInputs = JSON.parse($scope.rawString);
                        var isInputsNotEmpty = true;
                        _.each(parsedInputs, function (value) {
                            if (value === '') {
                                isInputsNotEmpty = false;
                                //returning false will break the loop, not checking other items unnecessarily
                                return false;
                            }
                        });
                        return isInputsNotEmpty;
                    } catch (e) {
                        return false;
                    }
                }

                function parseDefVal(defaultVal) {
                    //since typeof null is 'object' yet I don't want it to be stringify
                    if (defaultVal === null) {
                        return null;
                    } else if (typeof defaultVal === 'object') {
                        return JSON.stringify(defaultVal);
                    } else {
                        return defaultVal;
                    }
                }

                function formToRaw() {
                    // try to parse input value. if parse fails, keep the input value as it is.
                    $scope.rawString = JSON.stringify($scope.inputs, function(key, value) {
                        var parsedValue = '';
                        var exec;
                        try {
                            parsedValue = JSON.parse(value);
                        } catch(e) { }
                        if (typeof parsedValue === 'string') {
                            return value;
                        } else {
                            exec = /^\d+\.0+$/.exec(value);
                            return exec ? exec[0] : parsedValue;
                        }
                    }, 2);
                    $scope.valid = isValid();
                }

                function rawToForm() {
                    if ($scope.rawString === undefined) {
                        return;
                    }

                    sendErrorMessage(null);

                    try {
                        var parsedInputs = JSON.parse($scope.rawString);
                        _.each(parsedInputs, function (value, key) {
                            var parsedValue = value;
                            var exec;

                            try {
                                parsedValue = JSON.parse(value);
                            } catch (e) { }
                            // if input type is object (except null) avoid [Object object] by stringifying
                            // if input type will be changed by parsing again then we want to keep it a string, so we need to stringify it
                            // this handles "true" and "1" strings that will accidentally be parsed to true (boolean) and 1 (number) etc..
                            if ((value && typeof value === 'object') || typeof value !== typeof parsedValue) {
                                exec = /^\d+\.0+$/.exec(value);
                                parsedInputs[key] = exec ? exec[0] : JSON.stringify(value);
                            }
                        });

                        $scope.inputs = parsedInputs;
                    } catch (e) {
                        sendErrorMessage('Invalid JSON: ' + e.message);
                    }

                    $scope.valid = isValid();
                }

                function toggleInputsState(state) {
                    $scope.inputsState = state.toLocaleLowerCase();
                }

                function restoreDefault(paramName, defaultValue) {
                    $scope.inputs[paramName] = parseDefVal(defaultValue);
                }


                $scope.$watch('params', function (params) {
                    $scope.inputs = {};
                    _.each(params, function (value, key) {
                        $scope.inputs[key] = value.default !== undefined ? value.default : '';
                    });
                    $scope.rawString = JSON.stringify($scope.inputs);
                });

                // watching the raw json string changes, validating json on every change
                $scope.$watch('rawString', rawToForm);
                // cover scenario where key is missing and I just added it in form mode
                $scope.$watch('inputs', formToRaw, true);


                $scope.parseDefVal = parseDefVal;
                $scope.restoreDefault = restoreDefault;
                $scope.toggleInputsState = toggleInputsState;
                // expose functions for tests
                $scope.validateJSON = _validateJSON;
                $scope.validateJsonKeys = _validateJsonKeys;
                $scope.validateInputsNotEmpty = _validateInputsNotEmpty;
            }
        };
    });
