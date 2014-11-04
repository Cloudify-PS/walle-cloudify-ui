'use strict';

angular.module('cosmoUiApp')
    .controller('BlueprintsIndexCtrl', function ($scope, $location, $cookieStore, BreadcrumbsService, $timeout, $log, CloudifyService) {
        $scope.isAddDialogVisible = false;
        $scope.isDeployDialogVisible = false;
        $scope.isDeleteBlueprintVisible = false;
        $scope.lastExecutedPlan = null;
        $scope.selectedBlueprint = null;
        $scope.deleteInProcess = false;
        $scope.delErrorMessage = '';
        var _blueprintsArr = [];
        var cosmoError = false;
        var currentBlueprintToDelete = null;

        BreadcrumbsService.push('blueprints',
            {
                href: '#/blueprints',
                i18nKey: 'breadcrumb.blueprints',
                id: 'blueprints'
            });

        $scope.redirectTo = function (blueprint) {
            $location.path('/blueprint/' + blueprint.id + '/topology');
        };

        $scope.toggleAddDialog = function() {
            $scope.isAddDialogVisible = $scope.isAddDialogVisible === false;
        };

        $scope.toggleDeployDialog = function(blueprint) {

            console.log(['toggleDeployDialog', blueprint]);

            $scope.selectedBlueprint = blueprint || null;
            $scope.isDeployDialogVisible = $scope.isDeployDialogVisible === false;
        };

        $scope.toggleDeleteDialog = function() {
            $scope.isDeleteBlueprintVisible = $scope.isDeleteBlueprintVisible === false;
        };

        $scope.deleteBlueprint = function(blueprint) {
            currentBlueprintToDelete = blueprint;
            $scope.delBlueprintName = blueprint.id;
            $scope.delBlueprintError = false;
            $scope.toggleDeleteDialog();
        };

        $scope.confirmDeleteBlueprint = function() {
            _deleteBlueprint();
        };

        $scope.loadBlueprints = function() {
            $scope.blueprints = null;
            CloudifyService.blueprints.list()
                .then(function(data) {
                    cosmoError = false;
                    if (data.length < 1) {
                        $scope.blueprints = [];
                    } else {
                        $scope.blueprints = data;
                        updateDeployments();

                        if ($scope.isAddDialogVisible) {
                            $timeout(function() {
                                $scope.toggleAddDialog();
                            }, 100);
                        }
                    }

                }, function() {
                    cosmoError = true;
                });
        };

        $scope.uploadDone = function(blueprint_id) {
            $scope.redirectTo({
                id: blueprint_id
            });
        };

        $scope.redirectToDeployments = function() {
            $location.path('/deployments');
        };

        $scope.redirectToDeployment = function(deployment_id) {
            $location.path('/deployment/' + deployment_id + '/topology');
        };

        $scope.cosmoConnectionError = function() {
            return cosmoError;
        };

        function updateDeployments() {
            for (var i = 0; i < $scope.blueprints.length; i++) {
                var index = _getBlueprintArrNextIndex($scope.blueprints[i].id);
                _blueprintsArr[index].name = $scope.blueprints[i].name;
            }
        }

        function _getBlueprintArrNextIndex(blueprint_id) {
            var nextIndex = -1;
            for (var j = 0; j < _blueprintsArr.length; j++) {
                if (_blueprintsArr[j].id === blueprint_id) {
                    nextIndex = j;
                }
            }

            if (nextIndex === -1) {
                _blueprintsArr.push({
                    id: blueprint_id,
                    deployments: []
                });
                nextIndex = _blueprintsArr.length - 1;
            }

            return nextIndex;
        }

        function _deleteBlueprint() {
            if(currentBlueprintToDelete !== null && !$scope.deleteInProcess) {
                $scope.deleteInProcess = true;
                CloudifyService.blueprints.delete({id: currentBlueprintToDelete.id})
                    .then(function(data) {
                        if (data.error_code !== undefined) {
                            $scope.deleteInProcess = false;
                            $scope.delBlueprintError = true;
                            $scope.delErrorMessage = data.message;
                        } else {
                            $timeout(function() {
                                $scope.toggleDeleteDialog();
                                $scope.loadBlueprints();
                                $scope.deleteInProcess = false;
                            }, 1000);
                        }
                    });
            }
        }

        $scope.loadBlueprints();
    });
