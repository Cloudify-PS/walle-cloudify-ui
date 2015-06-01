'use strict';

angular.module('cosmoUiApp')
    .controller('BlueprintsIndexCtrl', function ($scope, $location, $cookieStore, BreadcrumbsService, $timeout, $log, CloudifyService, ngDialog) {
        $scope.isAddDialogVisible = false;
        $scope.isDeployDialogVisible = false;
        $scope.isDeleteBlueprintVisible = false;
        $scope.lastExecutedPlan = null;
        $scope.selectedBlueprint = null;
        $scope.deleteInProcess = false;
        $scope.delErrorMessage = '';
        var _blueprintsArr = [];
        var cosmoError = false;
        $scope.currentBlueprintToDelete = null;

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
            ngDialog.open({
                template: 'views/dialogs/upload.html',
                controller: 'FileSelectionDialogCtrl',
                scope: $scope,
                className: 'upload-dialog'
            });
        };

        $scope.toggleDeployDialog = function(blueprint) {
            $scope.selectedBlueprint = blueprint || null;
            ngDialog.open({
                template: 'views/dialogs/deploy.html',
                controller: 'DeployDialogCtrl',
                scope: $scope,
                className: 'deploy-dialog'
            });
        };

        $scope.toggleDeleteDialog = function() {
            ngDialog.open({
                template: 'views/dialogs/delete.html',
                controller: 'DeleteDialogCtrl',
                scope: $scope,
                className: 'delete-dialog'
            });
        };

        $scope.deleteBlueprint = function(blueprint) {
            $scope.currentBlueprintToDelete = blueprint;
            $scope.delBlueprintName = blueprint.id;
            $scope.delBlueprintError = false;
            $scope.toggleDeleteDialog();
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
            $scope.closeDialog();
            $scope.redirectTo({
                id: blueprint_id
            });
        };

        $scope.redirectToDeployments = function() {
            $location.path('/deployments');
        };

        $scope.redirectToDeployment = function(deployment_id) {
            $scope.closeDialog();
            $location.path('/deployment/' + deployment_id + '/topology');
        };

        $scope.closeDialog = function() {
            ngDialog.closeAll();
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

        $scope.loadBlueprints();
    });
