'use strict';

angular.module('cosmoUi')
    .controller('DeploymentsCtrl', function ($scope, RestService, $cookieStore, $location, $routeParams, BreadcrumbsService) {

        $scope.blueprints = $cookieStore.get('blueprints');
        $scope.selectedBlueprint = '';

        BreadcrumbsService.push('deployments',
            {
                href: '#/deployments',
                label: 'Deployments'
            });

        $scope.showDeployments = function(blueprintId) {
            if (blueprintId === $scope.selectedBlueprint) {
                $scope.selectedBlueprint = '';
            } else {
                $scope.selectedBlueprint = blueprintId;
            }
        };

        $scope.executeDeployment = function(deployment, selectedWorkflow) {
            RestService.executeBlueprint({'deploymentId': deployment.id, 'workflowId': selectedWorkflow});
            $cookieStore.remove('deploymentId');
            $cookieStore.put('deploymentId', deployment.id);
            $scope.redirectTo(deployment);
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

                        var workflows = JSON.parse(data[i].plan).workflows;
                        if (workflows !== undefined) {
                            $scope.blueprints[_getBlueprintIndex(data[i].blueprintId)].workflows = [];
                            for (var workflow in workflows) {
                                $scope.blueprints[_getBlueprintIndex(data[i].blueprintId)].workflows.push(workflow);
                            }
                        }
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

        if ($routeParams.blueprint !== undefined) {
            $scope.showDeployments($routeParams.blueprint.id);
        }
    });
