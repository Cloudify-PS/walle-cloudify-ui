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
    .directive('formRawParams', function (INPUT_STATE,$filter) {
        return {
            templateUrl: 'views/directives/formRawParams.html',
            restrict: 'A',
            scope: {
                'sendErrorMessage': '&onError',
                'params': '=',
                'rawString': '=',
                'valid': '='
            },
            link: function postLink(scope/*, element, attrs*/) {
                var $scope = scope;
                $scope.inputsState = INPUT_STATE.PARAMS;
                $scope.inputs = {};

                function setDeployError(msg) {
                    scope.sendErrorMessage({'msg': msg});
                }

                scope.$watch(function () {
                    return _validateJSON(false, true);
                }, function (newValue) {
                    scope.valid = newValue && _validateJsonKeys() && _validateInputsNotEmpty(); //set error message turned on
                });

                scope.$watch(function () {
                    return _validateInputsNotEmpty();
                }, function (newValue) {
                    scope.valid = newValue && _validateJsonKeys() && _validateJSON(false, true); //set error message turned on
                });


                // JSON keys validation, verifying all expected keys exists in JSON
                // if key is missing we want to display an error
                // if additional key is added and unexpected we want to display an error
                function _validateJsonKeys(skipErrorMessage) {
                    function isKeyInParams(key) {
                        if (key in scope.params) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }

                    var _json = $scope.rawString ? JSON.parse($scope.rawString) : {};
                    for (var expectedKey in scope.params) {
                        var value = _json[expectedKey];
                        if (value === undefined) {
                            if (!skipErrorMessage) {
                                setDeployError($filter('translate')('formRawParams.missingKeyInJson', {key: expectedKey}));
                            }
                            return false;
                        }
                    }
                    for (var key in _json) {
                        if (!isKeyInParams(key)) {
                            if (!skipErrorMessage) {
                                setDeployError($filter('translate')('formRawParams.unexpectedKeyInJson', {key: key}));
                            }
                            return false;
                        }
                    }
                    return true;
                }

                // JSON validation by parsing it
                function _validateJSON(skipKeys, skipErrorMessage) {
                    if ($scope.rawString === undefined) {
                        return false; // fail silently. we don't care about undefined. in this scenario. don't alert invalid json.
                    }
                    try {
                        JSON.parse($scope.rawString);
                        if (!skipErrorMessage) {
                            setDeployError(null);
                        }
                        return skipKeys || _validateJsonKeys();

                    } catch (e) {
                        setDeployError('Invalid JSON: ' + e.message);
                        return false;
                    }
                }

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
                    }
                    catch (e) {
                        return false;
                    }
                }

                function _parseInputs() {
                    var result = {};
                    _.each($scope.inputs, function (value, key) {
                        try {
                            var parsedValue = JSON.parse(value);
                            if (typeof(parsedValue) !== 'string') {
                                result[key] = parsedValue;
                            } else {
                                result[key] = value;
                            }
                        } catch (e) {
                            result[key] = value;
                        }
                    });
                    return result;
                }

                function _formToRaw() {
                    // if error message is shown & json is invalid, stop raw JSON update process until JSON is fixed & valid
                    if (!_validateJSON(true)) { // validate without keys
                        return;
                    }

                    // try to parse input value. if parse fails, keep the input value as it is.
                    $scope.rawString = JSON.stringify(_parseInputs(), null, 2);

                    // now that we updated the RAW value properly, we would like to get an error if a key is missing
                    _validateJsonKeys();
                }

                function _rawToForm() {
                    setDeployError(null);
                    try {
                        var parsedInputs = JSON.parse($scope.rawString);
                        _.each(parsedInputs, function (value, key) {
                            var parsedValue = value;

                            try {
                                parsedValue = JSON.parse(value);
                            } catch (e) {
                            }
                            // if input type is object (except null) avoid [Object object] by stringifying
                            // if input type will be changed by parsing again (see parseInputs) then we want to keep it a string, so we need to stringify it
                            // this handles "true" and "1" strings that will accidentally be parsed to true (boolean) and 1 (number) etc..
                            if (( !!value && typeof(value) === 'object') || typeof(value) !== typeof(parsedValue)) {
                                parsedInputs[key] = JSON.stringify(value);
                            }
                        });

                        $scope.inputs = parsedInputs;
                    } catch (e) {
                        $scope.inputsState = INPUT_STATE.RAW;
                        setDeployError('Invalid JSON: ' + e.message);
                    }
                }

                $scope.$watch('params', function () {
                    if (!!$scope.params) {
                        $scope.rawString = JSON.stringify($scope.params, null, 2);
                        $scope.inputsState = INPUT_STATE.PARAMS;
                    }
                });
                $scope.$watch('inputsState', function () {
                    if (!!$scope.selectedBlueprint) {
                        $scope.updateInputs();
                    }
                });

                // watching the raw json string changes, validating json on every change
                $scope.$watch('rawString', _rawToForm);

                $scope.$watch('params', function (params) {
                    scope.inputs = {};
                    if (!!params) {
                        _.each(params, function (value, key) {
                            scope.inputs[key] = value.default ? value.default : '';
                        });
                    }
                });

                // cover scenario where key is missing and I just added it in form mode
                $scope.$watch('inputs', _formToRaw, true);


                $scope.toggleInputsState = function (state) {
                    $scope.inputsState = INPUT_STATE[state];
                };

                $scope.updateInputs = function () {
                    if ($scope.inputsState === INPUT_STATE.RAW) {
                        _formToRaw();
                    } else {
                        _rawToForm();
                    }
                };


                $scope.parseDefVal = function (defaultVal) {
                    if (defaultVal === null) {
                        return 'null';
                    } else if (typeof defaultVal === 'string') {
                        return defaultVal;
                    } else {
                        return JSON.stringify(defaultVal);
                    }
                    ;

                    $scope.restoreDefault = function (paramName, defaultValue) {
                        $scope.inputs[paramName] = $scope.parseDefVal(defaultValue);
                    };

                    // expose functions to test
                    $scope.validateJSON = _validateJSON;
                    $scope.validateJsonKeys = _validateJsonKeys;
                    $scope.rawToForm = _rawToForm;
                    $scope.validateInputsNotEmpty = _validateInputsNotEmpty;
                }
            }
        }
    });
