'use strict';

angular.module('cosmoUi')
    .controller('BlueprintsIndexCtrl', function ($scope, $location, $cookieStore, RestService, BreadcrumbsService) {
        $scope.isAddDialogVisible = false;
        $scope.isDeployDialogVisible = false;
        $scope.lastExecutedPlan = null;
        $scope.selectedBlueprint = null;
        var _blueprintsArr = [];
        var cosmoError = false;

        BreadcrumbsService.push('blueprints',
            {
                href: '#/blueprints',
                i18nKey: 'breadcrumb.blueprints',
                id: 'blueprints'
            });

        $scope.redirectTo = function (blueprint) {
            console.log(['redirecting to', blueprint]);
            $location.path('/blueprint').search({id: blueprint.id, name: blueprint.id});
        };

        $scope.toggleAddDialog = function() {
            $scope.isAddDialogVisible = $scope.isAddDialogVisible === false;
        };

        $scope.toggleDeployDialog = function(blueprint) {
            $scope.selectedBlueprint = blueprint || null;
            $scope.isDeployDialogVisible = $scope.isDeployDialogVisible === false;
        };

        $scope.loadBlueprints = function() {
            RestService.loadBlueprints()
                .then(function(data) {
                    cosmoError = false;
                    if (data.length < 1) {
                        $scope.blueprints = [];
                    } else {
                        $scope.blueprints = data;
                        updateDeployments();

                        if ($scope.isAddDialogVisible) {
                            $scope.toggleAddDialog();
                        }
                    }

                }, function() {
                    cosmoError = true;
                });
        };

        $scope.redirectToDeployments = function(blueprint) {
            $location.path('/deployments').search({blueprint_id: blueprint.id});
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

        function _getBlueprintArrNextIndex(blueprintId) {
            var nextIndex = -1;
            for (var j = 0; j < _blueprintsArr.length; j++) {
                if (_blueprintsArr[j].id === blueprintId) {
                    nextIndex = j;
                }
            }

            if (nextIndex === -1) {
                _blueprintsArr.push({
                    id: blueprintId,
                    deployments: []
                });
                nextIndex = _blueprintsArr.length - 1;
            }

            return nextIndex;
        }

        $scope.loadBlueprints();

    });
