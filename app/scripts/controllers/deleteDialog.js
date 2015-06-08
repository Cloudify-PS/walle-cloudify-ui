'use strict';

angular.module('cosmoUiApp')
    .controller('DeleteDialogCtrl', function ($scope, $timeout, CloudifyService, DELETE_TYPES) {

        $scope.ignoreLiveNodes = false;
        $scope.deleteState = {
            itemToDelete: $scope.itemToDelete,
            type: DELETE_TYPES.BLUEPRINT,
            inProgress: false,
            errorMessage: ''
        };

        if (!!$scope.deleteState.itemToDelete.blueprint_id) {
            $scope.deleteState.type = DELETE_TYPES.DEPLOYMENT;
        } else  {
            $scope.deleteState.type = DELETE_TYPES.BLUEPRINT;
        }

        $scope.confirmDelete = function() {
            $scope.deleteState.inProcess = true;

            if(!!$scope.deleteState.itemToDelete) {
                $scope.deleteState.type = DELETE_TYPES.BLUEPRINT;
                CloudifyService.blueprints.delete({id: $scope.deleteState.itemToDelete.id})
                    .then(function(data) {
                        if (data.error_code !== undefined) {
                            $scope.deleteState.inProcess = false;
                            $scope.deleteState.errorMessage = data.message;
                        } else {
                            $timeout(function() {
                                $scope.closeDialog();
                                $scope.loadBlueprints();
                                $scope.deleteState.inProcess = false;
                            }, 1000);
                        }
                    }, function(e) {
                        $scope.deleteState.inProcess = false;
                        if(e.data.hasOwnProperty('message')) {
                            $scope.deleteState.errorMessage = e.data.message;
                        } else {
                            $scope.deleteState.errorMessage = 'An error occurred';
                        }
                    });
            } else if(!!$scope.deleteState.itemToDelete) {
                $scope.deleteState.type = DELETE_TYPES.DEPLOYMENT;
                CloudifyService.deployments.deleteDeploymentById({deployment_id: $scope.deleteState.itemToDelete.id, ignoreLiveNodes: $scope.ignoreLiveNodes})
                    .then(function(data){
                        $scope.deleteState.inProcess = false;
                        if(data.hasOwnProperty('message')) {
                            $scope.deleteState.errorMessage = data.message;
                        }
                        else {
                            $scope.closeDialog();
                            $timeout(function(){
                                $scope.loadDeployments();
                            }, 500);
                        }
                    }, function(e) {
                        $scope.deleteState.inProcess = false;
                        if(e.data.hasOwnProperty('message')) {
                            $scope.deleteState.errorMessage = e.data.message;
                        } else {
                            $scope.deleteState.errorMessage = 'An error occurred';
                        }
                    });
            }
        };

        $scope.toggleIgnoreLiveNodes = function() {
            $scope.ignoreLiveNodes = !$scope.ignoreLiveNodes;
        };
    });
