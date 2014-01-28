'use strict';

angular.module('cosmoUi')
    .controller('DeploymentsCtrl', function ($scope, RestService, $cookieStore, $location, $routeParams, BreadcrumbsService) {

        $scope.blueprints = null;
        $scope.selectedBlueprint = '';
        $scope.selectedWorkflow = null;
        var cosmoError = false;

        BreadcrumbsService.push('deployments',
            {
                href: '#/deployments',
                label: 'Deployments',
                id: 'deployments'
            });

        $scope.showDeployments = function(blueprintId) {
            if (blueprintId === $scope.selectedBlueprint) {
                $scope.selectedBlueprint = '';
            } else {
                $scope.selectedBlueprint = blueprintId;
            }
        };

        $scope.executeDeployment = function(deployment) {
            if ($scope.isExecuteEnabled()) {
                if (window.confirm('Execute deployment?')) {
                    RestService.executeDeployment(deployment.id);
                    $cookieStore.remove('deploymentId');
                    $cookieStore.put('deploymentId', deployment.id);
                    $scope.redirectTo(deployment);
                }
            }
        };

        $scope.isExecuting = function(deploymentId) {
            return deploymentId === $cookieStore.get('deploymentId');
        };

        $scope.isExecuteEnabled = function() {
            return $scope.selectedWorkflow !== null;
        };

        $scope.redirectTo = function (deployment) {
            console.log(['redirecting to', deployment]);
            $scope.selectedDeploymentID = deployment.id;
            $location.path('/deployment').search({deployment: JSON.stringify(deployment)});
        };

        $scope.cosmoConnectionOk = function() {
            return cosmoError;
        };

        function _loadDeployments() {
            RestService.loadBlueprints()
                .then(function(data) {
                    cosmoError = false;
                    $scope.blueprints = data;
//                    RestService.loadDeployments()
//                        .then(function(data) {
//                            for (var i = 0; i < data.length; i++) {
//                                var blueprint = $scope.blueprints[_getBlueprintIndex(data[i].blueprintId)];
//                                if (blueprint.deployments === undefined) {
//                                    blueprint.deployments = [];
//                                }
//                                blueprint.deployments.push(data[i]);
//                            }
//                        });
                },
                function() {
                    cosmoError = true;
                });
        }

//        function _getBlueprintIndex(blueprintId) {
//            var blueprintIndex = -1;
//            for (var j = 0; j < $scope.blueprints.length; j++) {
//                if ($scope.blueprints[j].id === blueprintId) {
//                    blueprintIndex = j;
//                }
//            }
//
//            return blueprintIndex;
//        }

        _loadDeployments();

        if ($routeParams.blueprint !== undefined) {
            $scope.showDeployments($routeParams.blueprint.id);
        }
    });
