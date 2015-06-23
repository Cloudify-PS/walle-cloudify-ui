'use strict';

angular.module('cosmoUiApp')
    .controller('DeployDialogCtrl', function ($scope, CloudifyService, INPUT_STATE ) {
        $scope.deployment_id = null;
        $scope.deployErrorMessage = null;
        $scope.inputs = {};
        $scope.inputsState = INPUT_STATE.PARAMS;

        $scope.showError = function(){
            return !!$scope.deployErrorMessage;
        };

        $scope.isDetailsInvalid = function(){
            return !$scope.selectedBlueprint || !$scope.deployment_id || $scope.showError();
        };

        $scope.isDeployEnabled = function () {
            // if error message is shown, deploy button should be disabled
            return _validateJSON() && _validateJsonKeys(true) && !$scope.isDetailsInvalid();
        };

        $scope.updateInputs = function() {
            if ($scope.inputsState === INPUT_STATE.RAW) {
                _formToRaw();
            } else {
                _rawToForm();
            }
        };


        $scope.isParamsVisible = function () {
            if ($scope.selectedBlueprint === null) {
                return;
            }
            return Object.getOwnPropertyNames($scope.selectedBlueprint.plan.inputs).length > 0;
        };

        $scope.deployBlueprint = function (blueprintId) {
            if (!$scope.isDeployEnabled()) {
                return;
            }

            // parse inputs so "true" string will become boolean etc.
            setDeployError(null);

            var params = {
                blueprint_id: blueprintId,
                deployment_id: $scope.deployment_id,
                inputs: JSON.parse($scope.rawString)
            };

            if ($scope.isDeployEnabled()) {
                $scope.inProcess = true;
                CloudifyService.blueprints.deploy(params)
                    .then(function (data) {
                        $scope.inProcess = false;
                        if (data.hasOwnProperty('message')) {
                            setDeployError(data.message);
                        }
                        else {
                            $scope.closeThisDialog();
                            $scope.redirectToDeployment($scope.deployment_id);
                        }
                    }, function (data) {
                        $scope.inProcess = false;
                        setDeployError(CloudifyService.getErrorMessage(data));

                    });
            }
        };

        $scope.$watch('deployment_id', function(){
            setDeployError(null);
        });

        $scope.toggleInputsState = function (state) {
            $scope.inputsState = INPUT_STATE[state];
        };

        $scope.$watch('selectedBlueprint', function (selectedBlueprint) {
            if (selectedBlueprint && selectedBlueprint.hasOwnProperty('plan')) {
                for (var name in selectedBlueprint.plan.inputs) {
                    var planInput = selectedBlueprint.plan.inputs[name];
                    // if input has no default value, setting it to null
                    if (planInput.hasOwnProperty('default')) {
                        $scope.inputs[name] = planInput.default;
                    } else {
                        $scope.inputs[name] = null;
                    }
                }
                $scope.rawString = JSON.stringify($scope.inputs, null, 2);
                $scope.inputsState = INPUT_STATE.PARAMS;
            }
        }, true);


        function _formToRaw() {
            // if error message is shown & json is invalid, stop raw JSON update process until JSON is fixed & valid
            if ( !_validateJSON(true) ){ // validate without keys
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
                    try{
                        parsedValue = JSON.parse(value);
                    }catch(e){}
                    // if input type is object (except null) avoid [Object object] by stringifying
                    // if input type will be changed by parsing again (see parseInputs) then we want to keep it a string, so we need to stringify it
                    // this handles "true" and "1" strings that will accidentally be parsed to true (boolean) and 1 (number) etc..
                    if ( ( !!value &&  typeof(value) === 'object') ||  typeof(value) !== typeof(parsedValue) ) {
                        parsedInputs[key] = JSON.stringify(value);
                    }
                });

                $scope.inputs = parsedInputs;
            } catch (e) {
                $scope.inputsState = INPUT_STATE.RAW;
                setDeployError('Invalid JSON: ' + e.message);
            }
        }

        // JSON validation by parsing it
        function _validateJSON( skipKeys ) {
            try {
                JSON.parse($scope.rawString);
                setDeployError( null );
                return skipKeys || _validateJsonKeys();

            } catch (e) {
                setDeployError( 'Invalid JSON: ' + e.message );
                return false;
            }
        }

        function setDeployError( msg ){
            $scope.deployErrorMessage = msg;
        }

        // JSON keys validation, verifying all expected keys exists in JSON
        // strict means check values are not null or ''
        // if key is missing (non strict) we want to display an error
        // if key is empty (strict) that return invalid, but don't display an error
        // if there's an error, we want to display it (so if strict mode fails, keep searching for error to display)
        function _validateJsonKeys( strict ) {
            var result = true;
            var _json = JSON.parse($scope.rawString);
            for (var i in $scope.selectedBlueprint.plan.inputs) {
                var value = _json[i];
                if (value === undefined ) { // when in strict mode disallow empty value
                    setDeployError('Missing ' + i + ' key in JSON');
                    result =  false;
                    return result; // no need to continue
                }
                if ( ( strict && ( value === null || value === '' ) ) ){
                    result = false; // lets continue.. perhaps there's an error we want to display
                }
            }
            return result;
        }

        function _parseInputs() {
            var result = {};
            _.each($scope.inputs, function(value,key){
                if ( value === '' || value === null ){
                    result[key] = null;
                    return;
                }

                try {
                    result[key] = JSON.parse(value);
                } catch(e) {
                    result[key] = value;
                }
            });
            return result;
        }

        $scope.$watch('inputsState', function() {
            if (!!$scope.selectedBlueprint) {
                $scope.updateInputs();
            }
        });

        // watching the raw json string changes, validating json on every change
        $scope.$watch('rawString', _validateJSON );

        // cover scenario where key is missing and I just added it in form mode
        $scope.$watch('inputs', _formToRaw, true);


        // expose functions to test
        $scope.validateJSON = _validateJSON;
        $scope.validateJsonKeys = _validateJsonKeys;
        $scope.rawToForm = _rawToForm;


    });
