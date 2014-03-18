'use strict';

angular.module('cosmoUi')
    .controller('DeploymentsCtrl', function ($scope, RestService, $cookieStore, $location, $routeParams, BreadcrumbsService) {

        $scope.blueprints = null;
        $scope.selectedBlueprint = '';
        $scope.isConfirmationDialogVisible = false;
        $scope.selectedDeployment = null;
        $scope.confirmationType = '';
        $scope.executedDeployments = [];
        var selectedWorkflow = null;
        var cosmoError = false;

        BreadcrumbsService.push('deployments',
            {
                href: '#/deployments',
                i18nKey: 'breadcrumb.deployments',
                id: 'deployments'
            });

        $scope.showDeployments = function(blueprintId) {
            if (blueprintId === $scope.selectedBlueprint) {
                $scope.selectedBlueprint = '';
            } else {
                $scope.selectedBlueprint = blueprintId;
            }
        };

        $scope.executeDeployment = function() {
            if ($scope.isExecuteEnabled()) {
                RestService.executeDeployment({
                    deploymentId: $scope.selectedDeployment.id,
                    workflowId: selectedWorkflow
                });
                $scope.redirectTo($scope.selectedDeployment);
            }
        };

        $scope.getWorkflows = function(deployment) {
            var plan = deployment.plan;
            var workflows = [];
            for (var i in plan.workflows) {
                workflows.push({
                    'name': i
                });
            }
            return workflows;
        };

        $scope.workflowSelected = function(workflow) {
            selectedWorkflow = workflow;
        };

        $scope.isExecuting = function(blueprintId, deploymentId) {
            return $scope.executedDeployments[blueprintId] !== undefined &&
                $scope.executedDeployments[blueprintId][deploymentId] !== null &&
                $scope.executedDeployments[blueprintId][deploymentId] !== undefined &&
                $scope.executedDeployments[blueprintId][deploymentId].status !== 'failed' &&
                $scope.executedDeployments[blueprintId][deploymentId].status !== 'terminated' &&
                $scope.executedDeployments[blueprintId][deploymentId].status !== 'canceled' &&
                $scope.executedDeployments[blueprintId][deploymentId].status !== null &&
                $scope.executedDeployments[blueprintId][deploymentId].length > 0;
        };

        $scope.cancelExecution = function(deployment) {
            var callParams = {
                'executionId': $scope.getExecutionAttr(deployment, 'id'),
                'state': 'cancel'
            };
            RestService.updateExecutionState(callParams).then(function() {
                $scope.executedDeployments[deployment.blueprintId][deployment.id] = null;
                $scope.showDeployments($scope.selectedBlueprint);
            });
        };

        $scope.isExecuteEnabled = function() {
            return selectedWorkflow !== null;
        };

        $scope.toggleConfirmationDialog = function(deployment, confirmationType) {
            $scope.confirmationType = confirmationType;
            $scope.selectedDeployment = deployment || null;
            $scope.isConfirmationDialogVisible = $scope.isConfirmationDialogVisible === false;
        };

        $scope.confirmConfirmationDialog = function(deployment) {
            if ($scope.confirmationType === 'execute') {
                $scope.executeDeployment();
            } else if ($scope.confirmationType === 'cancel') {
                $scope.cancelExecution(deployment);
                $scope.toggleConfirmationDialog();
            }
        };

        $scope.redirectTo = function (deployment) {
            console.log(['redirecting to', deployment]);
            $location.path('/deployment').search({id: deployment.id, blueprintId: deployment.blueprintId});
        };

        $scope.cosmoConnectionError = function() {
            return cosmoError;
        };

        function _loadExecutions(blueprintId, deploymentId) {
            RestService.getDeploymentExecutions(deploymentId)
                .then(function(data) {
                    if (data.length > 0) {
                        if ($scope.executedDeployments[blueprintId] === undefined) {
                            $scope.executedDeployments[blueprintId] = [];
                        }

                        for (var i = 0; i < data.length; i++) {
                            if (data[i].status !== null && data[i].status !== 'failed' && data[i].status !== 'terminated' && data[i].status !== 'canceled') {
                                $scope.executedDeployments[blueprintId][deploymentId] = data[i];
                            }
                        }

                    }
                });
        }

        $scope.getExecutionAttr = function(deployment, attr) {
            for (var blueprint in $scope.executedDeployments) {
                for (var dep in $scope.executedDeployments[blueprint]) {
                    if ($scope.executedDeployments[blueprint][dep] !== null) {
                        for (var i = 0; i < $scope.executedDeployments[blueprint][dep].length; i++) {
                            if (deployment.id === $scope.executedDeployments[blueprint][dep][i].deploymentId) {
                                return $scope.executedDeployments[blueprint][dep][i][attr];
                            }
                        }
                    }
                }
            }
        };

        function _loadDeployments() {
            RestService.loadBlueprints()
                .then(function(data) {
                    cosmoError = false;
                    $scope.blueprints = data;

                    for (var j = 0; j < data.length; j++) {
                        var deployments = data[j].deployments;
                        for (var i = 0; i < deployments.length; i++) {
                            _loadExecutions(deployments[i].blueprintId, deployments[i].id);
                        }
                    }
                },
                function() {
                    cosmoError = true;
                });
        }

        _loadDeployments();

        if ($routeParams.blueprint_id !== undefined) {
            $scope.showDeployments($routeParams.blueprint_id);
        }
    });
