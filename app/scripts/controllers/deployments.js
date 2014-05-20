'use strict';

angular.module('cosmoUi')
    .controller('DeploymentsCtrl', function ($scope, RestService, $cookieStore, $location, $routeParams, BreadcrumbsService, $timeout, $log) {

        $scope.blueprints = null;
        $scope.deployments = [];
        $scope.selectedBlueprint = '';
        $scope.isConfirmationDialogVisible = false;
        $scope.isDeleteDeploymentVisible = false;
        $scope.confirmationType = '';
        $scope.executedDeployments = [];
        $scope.selectedWorkflow = {
            data: null
        };
        var selectedWorkflows = [];
        var workflows = [];
        var cosmoError = false;
        var currentDeplyToDelete = null;

        BreadcrumbsService.push('deployments',
            {
                href: '#/deployments',
                i18nKey: 'breadcrumb.deployments',
                id: 'deployments'
            });

        $scope.executeDeployment = function(deployment) {
            if ($scope.isExecuteEnabled(deployment.id)) {
                RestService.executeDeployment({
                    deploymentId: $scope.selectedDeployment.id,
                    workflowId: selectedWorkflows[$scope.selectedDeployment.id]
                });
                $scope.redirectTo($scope.selectedDeployment);
            }
        };

        $scope.$watch('selectedWorkflow', function() {
            if ($scope.selectedWorkflow.data !== null) {
                $scope.selectedDeployment = $scope.selectedWorkflow.data.deployment || null;

                selectedWorkflows[$scope.selectedDeployment.id] = $scope.selectedWorkflow.data.value;
            }
        }, true);

        $scope.getWorkflows = function(deployment) {
            return workflows[deployment.id];
        };

        $scope.getSelectedWorkflow = function() {
            if ($scope.selectedDeployment !== undefined && selectedWorkflows[$scope.selectedDeployment.id] !== null) {
                return selectedWorkflows[$scope.selectedDeployment.id];
            }
        };

        $scope.isExecuting = function(blueprintId, deploymentId) {
            return $scope.executedDeployments[blueprintId] !== undefined &&
                $scope.executedDeployments[blueprintId][deploymentId] !== null &&
                $scope.executedDeployments[blueprintId][deploymentId] !== undefined &&
                $scope.executedDeployments[blueprintId][deploymentId].status !== 'failed' &&
                $scope.executedDeployments[blueprintId][deploymentId].status !== 'terminated' &&
                $scope.executedDeployments[blueprintId][deploymentId].status !== 'canceled' &&
                $scope.executedDeployments[blueprintId][deploymentId].status !== null;
        };

        $scope.cancelExecution = function(deployment) {
            var callParams = {
                'executionId': $scope.getExecutionAttr(deployment, 'id'),
                'state': 'cancel'
            };
            RestService.updateExecutionState(callParams).then(function() {
                $scope.executedDeployments[deployment.blueprintId][deployment.id] = null;
            });
        };

        $scope.isExecuteEnabled = function(deployment_id) {
            return selectedWorkflows[deployment_id] !== undefined;
        };

        $scope.toggleConfirmationDialog = function(deployment, confirmationType) {
            if (confirmationType === 'execute' && selectedWorkflows[deployment.id] === undefined) {
                return;
            }
            $scope.selectedDeployment = deployment;
            $scope.confirmationType = confirmationType;
            $scope.isConfirmationDialogVisible = $scope.isConfirmationDialogVisible === false;
        };

        $scope.confirmConfirmationDialog = function(deployment) {
            if ($scope.confirmationType === 'execute') {
                $scope.executeDeployment(deployment);
            } else if ($scope.confirmationType === 'cancel') {
                $scope.cancelExecution(deployment);
                $scope.toggleConfirmationDialog();
            }
        };

        $scope.redirectTo = function (deployment) {
            $log.info(['redirecting to', deployment]);
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
                                selectedWorkflows[deploymentId] = data[i].workflowId;
                                $scope.executedDeployments[blueprintId][deploymentId] = data[i];
                            }
                        }
                    }
                });

            if ($location.path() === '/deployments') {
                $timeout(function(){
                    _loadExecutions(blueprintId, deploymentId);
                }, 60000);
            }
        }

        $scope.getExecutionAttr = function(deployment, attr) {
            for (var blueprint in $scope.executedDeployments) {
                for (var dep in $scope.executedDeployments[blueprint]) {
                    if ($scope.executedDeployments[blueprint][dep] !== null) {
                        if (deployment.id === $scope.executedDeployments[blueprint][dep].deploymentId) {
                            return $scope.executedDeployments[blueprint][dep][attr];
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
                    $scope.deployments = [];

                    for (var j = 0; j < data.length; j++) {
                        var deployments = data[j].deployments;
                        $scope.deployments = $scope.deployments.concat(data[j].deployments);
                        for (var i = 0; i < deployments.length; i++) {
                            _loadExecutions(deployments[i].blueprintId, deployments[i].id);
                            workflows[deployments[i].id] = [];
                            for (var workflow in deployments[i].plan.workflows) {
                                workflows[deployments[i].id].push({
                                    value: workflow,
                                    label: workflow,
                                    deployment: deployments[i]
                                });
                            }
                        }
                    }
                },
                function() {
                    cosmoError = true;
                });
        }

        _loadDeployments();

        function deleteDeployment() {
            if(currentDeplyToDelete !== null) {
                RestService.deleteDeploymentById({deploymentId: currentDeplyToDelete.id})
                    .then(function(data){
                        console.log(['Deployment deleted response: ', data]);
                    });
                currentDeplyToDelete = null;
            }
        }

        $scope.deleteDeployment = function(deployment) {
            currentDeplyToDelete = deployment;
            $scope.isDeleteDeploymentVisible = true;
        }

        $scope.closeDeleteDialog = function() {
            $scope.isDeleteDeploymentVisible = false;
            currentDeplyToDelete = null;
        }

        $scope.confirmDeleteDeployment = function() {
            $scope.isDeleteDeploymentVisible = false;
            deleteDeployment();
        }



    });
