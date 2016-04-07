'use strict';

angular.module('cosmoUiApp')
    .controller('DeployDialogCtrl', function ($scope, cloudifyClient, CloudifyService, $translate) {
        $scope.deployment_id = null;
        $scope.deployErrorMessage = null;
        $scope.inputsValid = true;

        cloudifyClient.blueprints.get($scope.blueprintId, null).then(function (result) {
            $scope.selectedBlueprint = result.data || null;
        }, function (result) {
            setError(CloudifyService.getErrorMessage(result) || $translate.instant('permissionError'));
        });

        $scope.isDetailsInvalid = function () {
            return !$scope.selectedBlueprint || !$scope.deployment_id || $scope.deployErrorMessage;
        };

        $scope.isDeployEnabled = function () {
            // if error message is shown, deploy button should be disabled
            return $scope.inputsValid && !$scope.isDetailsInvalid();
        };

        $scope.isParamsVisible = function () {
            if ($scope.selectedBlueprint === null) {
                return;
            }
            return Object.getOwnPropertyNames($scope.selectedBlueprint.plan.inputs).length > 0;
        };

        $scope.deployBlueprint = function (blueprintId) {

            // parse inputs so "true" string will become boolean etc.
            setError(null);

            $scope.inProcess = true;
            cloudifyClient.deployments.create(blueprintId, $scope.deployment_id, $scope.rawString ? JSON.parse($scope.rawString) : null)
                .then(function (result) {
                    var data = result.data;
                    $scope.inProcess = false;
                    if (data.hasOwnProperty('message')) {
                        setError(data.message);
                    } else {
                        $scope.onCreate({id: result.data.id});
                        $scope.closeThisDialog();
                    }
                }, function (data) {
                    $scope.inProcess = false;
                    setError(CloudifyService.getErrorMessage(data));

                });
        };

        $scope.$watch('deployment_id', function () {
            setError(null);
        });

        function setError(msg) {
            $scope.deployErrorMessage = msg;
        }

        $scope.setError = setError;

    });
