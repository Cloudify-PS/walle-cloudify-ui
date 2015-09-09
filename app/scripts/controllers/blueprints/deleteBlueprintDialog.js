'use strict';

angular.module('cosmoUiApp')
    .controller('DeleteBlueprintDialogCtrl', function ($scope, cloudifyClient, $log ) {



        $scope.confirmDelete = function ( ) {
            $scope.inProcess = true;

            if (!!$scope.blueprint) {
                cloudifyClient.blueprints.delete( $scope.blueprint.id )
                    .then(function (data) {
                        if (data.error_code !== undefined) {
                            $scope.inProcess = false;
                            $scope.errorMessage = data.message;
                        } else {
                            $scope.closeThisDialog();
                            $scope.onDone();
                            $scope.inProcess = false;
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
                $log.error('blueprint id is missing!!');
            }
        };
    });
