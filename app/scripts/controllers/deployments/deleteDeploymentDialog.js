'use strict';

angular.module('cosmoUiApp')
    .controller('DeleteDeploymentDialogCtrl', function ($scope, cloudifyClient, $log ) {

        $scope.confirmDelete = function( force ) {
            $scope.inProcess = true;

            if (!!$scope.deployment) {

                cloudifyClient.deployments.delete($scope.deployment.id, !!force )
                    .then(function (result) {
                        var data = result.data;
                        $scope.inProcess = false;
                        if (data.hasOwnProperty('message')) {
                            $scope.errorMessage = data.message;
                        }
                        else {
                            $scope.closeThisDialog();
                            $scope.onDone();
                        }
                    }, function (e) {
                        $scope.inProcess = false;
                        if (e.data.hasOwnProperty('message')) {
                            $scope.errorMessage = e.data.message;
                        } else {
                            $scope.errorMessage = 'An error occurred';
                        }
                    });

            }else{
                $log.error('deployment id is missing!');
            }
        };
    });
