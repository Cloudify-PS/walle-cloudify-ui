'use strict';

angular.module('cosmoUi')
    .controller('DeploymentsCtrl', function ($scope, RestService, $cookieStore, $location) {

        $scope.blueprints = $cookieStore.get('blueprints');
        $scope.selectedBlueprint = '';

        $scope.showDeployments = function(blueprintId) {
            if (blueprintId === $scope.selectedBlueprint) {
                $scope.selectedBlueprint = '';
            } else {
                $scope.selectedBlueprint = blueprintId;
            }
        };

        $scope.executeDeployment = function(deployment) {
            RestService.executeDeployment(deployment.id);
            $cookieStore.remove('deploymentId');
            $cookieStore.put('deploymentId', deployment.id);
        };

        $scope.isExecuting = function(deploymentId) {
            return deploymentId === $cookieStore.get('deploymentId');
        };

        $scope.redirectTo = function (deployment) {
            console.log(['redirecting to', deployment]);
            $scope.selectedDeploymentID = deployment.id;
            $location.path('/deployment').search({deployment: JSON.stringify(deployment)});
        };

        function _loadDeployments() {
            RestService.loadDeployments()
                .then(function(data) {
                    for (var i = 0; i < data.length; i++) {
                        $scope.blueprints[_getBlueprintIndex(data[i].blueprintId)].deployments.push(data[i]);
                    }
                });
        }

        function _getBlueprintIndex(blueprintId) {
            var blueprintIndex = -1;
            for (var j = 0; j < $scope.blueprints.length; j++) {
                if ($scope.blueprints[j].id === blueprintId) {
                    blueprintIndex = j;
                }
            }

            return blueprintIndex;
        }

        _loadDeployments();
    });
