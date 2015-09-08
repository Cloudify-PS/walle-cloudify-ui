'use strict';

angular.module('cosmoUiApp')
    .controller('DeleteDialogCtrl', function ($scope, CloudifyService, DELETE_TYPES, $log, DIALOG_EVENTS ) {
        $scope.ignoreLiveNodes = false;
        $scope.deleteState = {
            itemToDelete: $scope.itemToDelete,
            type: DELETE_TYPES.BLUEPRINT,
            inProgress: false,
            errorMessage: ''
        };

        if ( !!$scope.deleteState && !!$scope.deleteState.itemToDelete ) {
            if (!!$scope.deleteState.itemToDelete.blueprint_id) {
                $scope.deleteState.type = DELETE_TYPES.DEPLOYMENT;
            } else {
                $scope.deleteState.type = DELETE_TYPES.BLUEPRINT;
            }
        }

        $scope.confirmDelete = function() {
            $scope.deleteState.inProcess = true;

            if(!!$scope.deleteState.itemToDelete) {
                $log.info('deleting a',$scope.deleteState.type);
                switch($scope.deleteState.type) {
                case DELETE_TYPES.BLUEPRINT:
                    CloudifyService.blueprints.delete({id: $scope.deleteState.itemToDelete.id})
                        .then(function(data) {
                            if (data.error_code !== undefined) {
                                $scope.deleteState.inProcess = false;
                                $scope.deleteState.errorMessage = data.message;
                            } else {
                                $scope.$emit(DIALOG_EVENTS.BLUEPRINT_DELETED);
                                $scope.closeThisDialog();
                                $scope.deleteState.inProcess = false;
                            }
                        }, function(e) {
                            $scope.deleteState.inProcess = false;
                            if(e.data.hasOwnProperty('message')) {
                                $scope.deleteState.errorMessage = e.data.message;
                            } else {
                                $scope.deleteState.errorMessage = 'An error occurred';
                            }
                        });
                    break;
                case DELETE_TYPES.DEPLOYMENT:
                    CloudifyService.deployments.deleteDeploymentById({deployment_id: $scope.deleteState.itemToDelete.id, ignoreLiveNodes: $scope.ignoreLiveNodes})
                        .then(function(data){
                            $scope.deleteState.inProcess = false;
                            if(data.hasOwnProperty('message')) {
                                $scope.deleteState.errorMessage = data.message;
                            }
                            else {
                                $scope.$emit(DIALOG_EVENTS.DEPLOYMENT_DELETED);
                                $scope.closeThisDialog();
                            }
                        }, function(e) {
                            $scope.deleteState.inProcess = false;
                            if(e.data.hasOwnProperty('message')) {
                                $scope.deleteState.errorMessage = e.data.message;
                            } else {
                                $scope.deleteState.errorMessage = 'An error occurred';
                            }
                        });
                    break;
                }
            }
        };
    });
