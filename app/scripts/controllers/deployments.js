'use strict';

angular.module('cosmoUi')
    .controller('DeploymentsCtrl', function ($scope, RestService, $cookieStore, $location, $routeParams, BreadcrumbsService, $timeout, $log) {

        $scope.blueprints = null;
        $scope.deployments = [];
        $scope.selectedBlueprint = '';
        $scope.isConfirmationDialogVisible = false;
        $scope.isDeleteDeploymentVisible = false;
        $scope.delDeployError = false;
        $scope.ignoreLiveNodes = false;
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
                    deployment_id: $scope.selectedDeployment.id,
                    workflow_id: selectedWorkflows[$scope.selectedDeployment.id]
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

        $scope.isExecuting = function(blueprint_id, deployment_id) {
            return $scope.executedDeployments[blueprint_id] !== undefined &&
                $scope.executedDeployments[blueprint_id][deployment_id] !== null &&
                $scope.executedDeployments[blueprint_id][deployment_id] !== undefined &&
                $scope.executedDeployments[blueprint_id][deployment_id].status !== 'failed' &&
                $scope.executedDeployments[blueprint_id][deployment_id].status !== 'terminated' &&
                $scope.executedDeployments[blueprint_id][deployment_id].status !== 'canceled' &&
                $scope.executedDeployments[blueprint_id][deployment_id].status !== null;
        };

        $scope.cancelExecution = function(deployment) {
            var callParams = {
                'execution_id': $scope.getExecutionAttr(deployment, 'id'),
                'state': 'cancel'
            };
            RestService.updateExecutionState(callParams).then(function() {
                $scope.executedDeployments[deployment.blueprint_id][deployment.id] = null;
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
            $location.path('/deployment').search({id: deployment.id, blueprint_id: deployment.blueprint_id});
        };

        $scope.cosmoConnectionError = function() {
            return cosmoError;
        };

        function _loadExecutions(blueprint_id, deployment_id) {
            RestService.getDeploymentExecutions(deployment_id)
                .then(function(data) {
                    if (data.length > 0) {
                        if ($scope.executedDeployments[blueprint_id] === undefined) {
                            $scope.executedDeployments[blueprint_id] = [];
                        }

                        for (var i = 0; i < data.length; i++) {
                            if (data[i].status !== null && data[i].status !== 'failed' && data[i].status !== 'terminated' && data[i].status !== 'canceled') {
                                selectedWorkflows[deployment_id] = data[i].workflow_id;
                                $scope.executedDeployments[blueprint_id][deployment_id] = data[i];
                            }
                        }
                    }
                });

            if ($location.path() === '/deployments') {
//                $timeout(function(){
//                    _loadExecutions(blueprint_id, deployment_id);
//                }, 60000);
            }
        }

        $scope.getExecutionAttr = function(deployment, attr) {
            for (var blueprint in $scope.executedDeployments) {
                for (var dep in $scope.executedDeployments[blueprint]) {
                    if ($scope.executedDeployments[blueprint][dep] !== null) {
                        if (deployment.id === $scope.executedDeployments[blueprint][dep].deployment_id) {
                            return $scope.executedDeployments[blueprint][dep][attr];
                        }
                    }
                }
            }
        };

        function _loadDeployments() {
            $scope.blueprints = null;
            $scope.deployments = [];
            RestService.loadBlueprints()
                .then(function(data) {
                    cosmoError = false;
                    $scope.blueprints = data;
                    $scope.deployments = [];

                    for (var j = 0; j < data.length; j++) {
                        var deployments = data[j].deployments;
                        $scope.deployments = $scope.deployments.concat(data[j].deployments);
                        for (var i = 0; i < deployments.length; i++) {
                            _loadExecutions(deployments[i].blueprint_id, deployments[i].id);
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
                RestService.deleteDeploymentById({deployment_id: currentDeplyToDelete.id, ignoreLiveNodes: $scope.ignoreLiveNodes})
                    .then(function(data){
                        if(data.hasOwnProperty('message')) {
                            $scope.delDeployError = data.message;
                        }
                        else {
                            closeDeleteDialog();
                            _loadDeployments();
                        }
                    });
                //currentDeplyToDelete = null;
            }
        }

        $scope.deleteDeployment = function(deployment) {
            currentDeplyToDelete = deployment;
            $scope.delDeployError = false;
            $scope.ignoreLiveNodes = false;
            $scope.delDeployName = deployment.id;
            $scope.isDeleteDeploymentVisible = true;
        };

        function closeDeleteDialog() {
            $scope.isDeleteDeploymentVisible = false;
            currentDeplyToDelete = null;
        }
        $scope.closeDeleteDialog = closeDeleteDialog;

        $scope.confirmDeleteDeployment = function() {
            deleteDeployment();
        };

        $scope.toggleIgnoreLiveNodes = function() {
            $scope.ignoreLiveNodes = !$scope.ignoreLiveNodes;
        };

    });
