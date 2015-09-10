'use strict';

angular.module('cosmoUiApp')
    .controller('DeployDialogCtrl', function ($scope, cloudifyClient, CloudifyService ) {
        $scope.deployment_id = null;
        $scope.deployErrorMessage = null;
        $scope.inputsValid = true;

        $scope.showError = function(){
            return !!$scope.deployErrorMessage;
        };

        $scope.isDetailsInvalid = function(){
            return !$scope.selectedBlueprint || !$scope.deployment_id || $scope.showError();
        };

        $scope.isDeployEnabled = function () {
            // if error message is shown, deploy button should be disabled
            return  $scope.inputsValid && !$scope.isDetailsInvalid();
        };

        $scope.isParamsVisible = function () {
            if ($scope.selectedBlueprint === null) {
                return;
            }
            return Object.getOwnPropertyNames($scope.selectedBlueprint.plan.inputs).length > 0;
        };

        $scope.deployBlueprint = function (blueprintId) {

            // parse inputs so "true" string will become boolean etc.
            setDeployError(null);

            $scope.inProcess = true;
            cloudifyClient.deployments.create(blueprintId, $scope.deployment_id, JSON.parse($scope.rawString))
                .then(function (result) {
                    var data = result.data;
                    $scope.inProcess = false;
                    if (data.hasOwnProperty('message')) {
                        setDeployError(data.message);
                    }
                    else {
                        $scope.onCreate({id: $scope.deployment_id});
                        $scope.closeThisDialog();
                    }
                }, function (data) {
                    $scope.inProcess = false;
                    setDeployError(CloudifyService.getErrorMessage(data));

                });
        };

        $scope.$watch('deployment_id', function(){
            setDeployError(null);
        });

        function setDeployError( msg ){
            $scope.deployErrorMessage = msg;
        }

        $scope.setDeployError = setDeployError;



    });
