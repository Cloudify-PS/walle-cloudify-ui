'use strict';

angular.module('cosmoUiApp')
    .controller('DeleteDeploymentDialogCtrl', function ($scope, cloudifyClient, $log, $timeout) {

        $scope.confirmDelete = function (force) {
            $scope.inProcess = true;
            $scope.inForceProcess = force;

            if (!!$scope.deployment) {
                cloudifyClient.deployments.delete($scope.deployment.id, !!force)
                    .then(function (result) {
                        var data = result.data;
                        $scope.inProcess = $scope.inForceProcess = false;
                        if (data.hasOwnProperty('message')) {
                            $scope.errorMessage = data.message;
                        } else {
                            $scope.closeThisDialog();
                            $scope.onDelete();
                        }
                    }, function (e) {
                        $scope.inProcess = $scope.inForceProcess = false;
                        if (e.data.hasOwnProperty('message')) {
                            $scope.errorMessage = e.data.message;
                        } else {
                            $scope.errorMessage = 'An error occurred';
                        }
                    });
                $timeout($scope.onBegin, 500);

            } else {
                $log.error('deployment id is missing!');
            }
        };
    });
