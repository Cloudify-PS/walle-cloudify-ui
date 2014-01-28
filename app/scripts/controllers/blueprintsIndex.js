'use strict';

angular.module('cosmoUi')
    .controller('BlueprintsIndexCtrl', function ($scope, $location, $cookieStore, RestService, BreadcrumbsService) {
        $scope.isAddDialogVisible = false;
        $scope.selectedBlueprintId = null;
        $scope.lastExecutedPlan = null;
        $scope.deploymentId = null;
        var _blueprintsArr = [];
        var cosmoError = false;

        BreadcrumbsService.push('blueprints',
            {
                href: '#/blueprints',
                label: 'Blueprints',
                id: 'blueprints'
            });

        $scope.redirectTo = function (blueprint) {
            console.log(['redirecting to', blueprint]);
            $scope.selectedBlueprintId = blueprint.id;
            $location.path('/blueprint').search({id: blueprint.id, name: blueprint.name});
        };

        $scope.toggleAddDialog = function() {
            $scope.isAddDialogVisible = $scope.isAddDialogVisible === false;
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
                    }

                }, function(e) {
                    cosmoError = true;
                });
        };

        $scope.deployBlueprint = function(blueprint) {
            RestService.deployBlueprint(blueprint.id)
                .then(function(deployment) {
                    $location.path('/deployments').search({blueprint: blueprint});
                });
        };

        $scope.cosmoConnectionOk = function() {
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
