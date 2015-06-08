'use strict';

angular.module('cosmoUiApp')
    .controller('BlueprintsIndexCtrl', function ($scope, $location, $cookieStore, BreadcrumbsService, $timeout, $log, CloudifyService, ngDialog) {
        $scope.lastExecutedPlan = null;
        $scope.selectedBlueprint = null;
        $scope.managerError = false;
        var _blueprintsArr = [];
        var _dialog = null;
        $scope.itemToDelete = null;

        BreadcrumbsService.push('blueprints',
            {
                href: '#/blueprints',
                i18nKey: 'breadcrumb.blueprints',
                id: 'blueprints'
            });

        $scope.redirectTo = function (blueprint) {
            $location.path('/blueprint/' + blueprint.id + '/topology');
        };

        $scope.openAddDialog = function() {
            if (_isDialogOpen()) {
                return;
            }
            _dialog = ngDialog.open({
                template: 'views/dialogs/upload.html',
                controller: 'FileSelectionDialogCtrl',
                scope: $scope,
                className: 'upload-dialog'
            });
        };

        $scope.openDeployDialog = function(blueprint) {
            if (_isDialogOpen()) {
                return;
            }
            $scope.selectedBlueprint = blueprint || null;
            _dialog = ngDialog.open({
                template: 'views/dialogs/deploy.html',
                controller: 'DeployDialogCtrl',
                scope: $scope,
                className: 'deploy-dialog'
            });
        };

        $scope.openDeleteDialog = function() {
            if (_isDialogOpen()) {
                return;
            }
            _dialog = ngDialog.open({
                template: 'views/dialogs/delete.html',
                controller: 'DeleteDialogCtrl',
                scope: $scope,
                className: 'delete-dialog'
            });
        };

        $scope.deleteBlueprint = function(blueprint) {
            $scope.itemToDelete = blueprint;
            $scope.openDeleteDialog();
        };

        $scope.loadBlueprints = function() {
            $scope.blueprints = null;
            CloudifyService.blueprints.list()
                .then(function(data) {
                    $scope.managerError = false;
                    if (data.length < 1) {
                        $scope.blueprints = [];
                    } else {
                        $scope.blueprints = data;
                        updateDeployments();
                        $scope.closeDialog();
                    }

                }, function() {
                    $scope.managerError = true;
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
            if (_dialog !== null) {
                ngDialog.close(_dialog.id);
            }
            _dialog = null;
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

        function _isDialogOpen() {
            return _dialog !== null && ngDialog.isOpen(_dialog.id);
        }

        $scope.loadBlueprints();
    });
