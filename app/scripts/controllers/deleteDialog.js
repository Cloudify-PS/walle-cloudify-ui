'use strict';

angular.module('cosmoUiApp')
    .controller('DeleteDialogCtrl', function ($scope, $timeout, CloudifyService) {

        if (!!$scope.currentBlueprintToDelete) {
            $scope.deleteType = 'blueprint';
        } else if (!!$scope.currentDeployToDelete) {
            $scope.deleteType = 'deployment';
        }

        $scope.confirmDelete = function() {
            $scope.deleteInProcess = true;

            if(!!$scope.currentBlueprintToDelete) {
                $scope.deleteType = 'blueprint';
                CloudifyService.blueprints.delete({id: $scope.currentBlueprintToDelete.id})
                    .then(function(data) {
                        if (data.error_code !== undefined) {
                            $scope.deleteInProcess = false;
                            $scope.delError = true;
                            $scope.delErrorMessage = data.message;
                        } else {
                            $timeout(function() {
                                $scope.closeDialog();
                                $scope.loadBlueprints();
                                $scope.deleteInProcess = false;
                            }, 1000);
                        }
                    }, function(e) {
                        $scope.deleteInProcess = false;
                        $scope.delError = true;
                        if(e.data.hasOwnProperty('message')) {
                            $scope.delErrorMessage = e.data.message;
                        } else {
                            $scope.delErrorMessage = 'An error occurred';
                        }
                    });
            } else if(!!$scope.currentDeployToDelete) {
                $scope.deleteType = 'deployment';
                CloudifyService.deployments.deleteDeploymentById({deployment_id: $scope.currentDeployToDelete.id, ignoreLiveNodes: $scope.ignoreLiveNodes})
                    .then(function(data){
                        $scope.deleteInProcess = false;
                        if(data.hasOwnProperty('message')) {
                            $scope.delError = data.message;
                        }
                        else {
                            $scope.closeDialog();
                            $timeout(function(){
                                $scope.loadDeployments();
                            }, 500);
                        }
                    }, function(e) {
                        $scope.deleteInProcess = false;
                        if(e.data.hasOwnProperty('message')) {
                            $scope.delError = e.data.message;
                        } else {
                            $scope.delError = 'An error occurred';
                        }
                    });
            }
        }
    });
