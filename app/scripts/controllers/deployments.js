'use strict';

angular.module('cosmoUiApp')
    .controller('DeploymentsCtrl', function ($scope, RestService, $cookieStore, $location, $routeParams, BreadcrumbsService, $timeout) {

        $scope.blueprints = null;
        $scope.deployments = [];
        $scope.selectedBlueprint = '';
        $scope.isConfirmationDialogVisible = false;
        $scope.isDeleteDeploymentVisible = false;
        $scope.delDeployError = false;
        $scope.deleteInProcess = false;
        $scope.executedErr = false;
        $scope.ignoreLiveNodes = false;
        $scope.confirmationType = '';
        var _executedDeployments = [];
        $scope.selectedWorkflow = {
            data: null
        };
        var selectedWorkflows = [];
        var workflows = [];
        var cosmoError = false;
        var currentDeployToDelete = null;

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
                    workflow_id: selectedWorkflows[$scope.selectedDeployment.id],
                    parameters: $scope.selectedWorkflow.data.parameters
                }).then(function(execution) {
                    if(execution.hasOwnProperty('error_code')) {
                        $scope.executedErr = execution.message;
                    }
                    else {
                        $scope.redirectTo($scope.selectedDeployment);
                    }
                });

            }
        };

        $scope.$watch('selectedWorkflow', function() {
            if ($scope.selectedWorkflow.data !== null) {
                selectedWorkflows[$scope.selectedWorkflow.data.deployment] = $scope.selectedWorkflow.data.value;
            }
        }, true);

        $scope.getWorkflows = function(deployment) {
            return workflows[deployment.id];
        };

        $scope.getSelectedWorkflow = function() {
            if ($scope.selectedDeployment !== undefined && selectedWorkflows[$scope.selectedDeployment] !== null) {
                return selectedWorkflows[$scope.selectedDeployment];
            }
        };

        $scope.isExecuting = function(blueprint_id, deployment_id) {
            return _executedDeployments[blueprint_id] !== undefined &&
                _executedDeployments[blueprint_id][deployment_id] !== null &&
                _executedDeployments[blueprint_id][deployment_id] !== undefined &&
                _executedDeployments[blueprint_id][deployment_id].status !== 'failed' &&
                _executedDeployments[blueprint_id][deployment_id].status !== 'terminated' &&
                _executedDeployments[blueprint_id][deployment_id].status !== 'cancelled' &&
                _executedDeployments[blueprint_id][deployment_id].status !== null;
        };

        $scope.cancelExecution = function(deployment) {
            var callParams = {
                'execution_id': $scope.getExecutionAttr(deployment, 'id'),
                'state': 'cancel'
            };
            RestService.updateExecutionState(callParams).then(function(data) {
                if(data.hasOwnProperty('error_code')) {
                    $scope.executedErr = data.message;
                }
                else {
                    _executedDeployments[deployment.blueprint_id][deployment.id] = null;
                    $scope.toggleConfirmationDialog();
                }
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
            }
        };

        $scope.redirectTo = function (deployment) {
            $location.path('/deployment/' + deployment.id + '/topology');
        };

        $scope.cosmoConnectionError = function() {
            return cosmoError;
        };

        function _loadExecutions(blueprint_id, deployment_id) {
            RestService.getDeploymentExecutions(deployment_id)
                .then(function(data) {
                    if (data.length > 0) {
                        if (_executedDeployments[blueprint_id] === undefined) {
                            _executedDeployments[blueprint_id] = [];
                        }

                        for (var i = 0; i < data.length; i++) {
                            if (data[i].status !== null && data[i].status !== 'failed' && data[i].status !== 'terminated' && data[i].status !== 'cancelled') {
                                selectedWorkflows[deployment_id] = data[i].workflow_id;
                                _executedDeployments[blueprint_id][deployment_id] = data[i];
                            } else if (data[i].status === 'failed' || data[i].status === 'terminated' || data[i].status === 'cancelled') {
                                _executedDeployments[blueprint_id][deployment_id] = null;
                            }
                        }
                    }
                });

            if ($location.path() === '/deployments') {
                $timeout(function(){
                    _loadExecutions(blueprint_id, deployment_id);
                }, 60000);
            }
        }

        $scope.getExecutionAttr = function(deployment, attr) {
            for (var blueprint in _executedDeployments) {
                for (var dep in _executedDeployments[blueprint]) {
                    if (_executedDeployments[blueprint][dep] !== null) {
                        if (deployment.id === _executedDeployments[blueprint][dep].deployment_id) {
                            return _executedDeployments[blueprint][dep][attr];
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
                            for (var w in deployments[i].workflows) {
                                var workflow = deployments[i].workflows[w];
                                workflows[deployments[i].id].push({
                                    value: workflow.name,
                                    label: workflow.name,
                                    deployment: deployments[i].id,
//                                    parameters: deployments[i].parameters
                                    parameters: {
                                        "agent_user": "agent_user",
                                        "flavor_name": "flavor_name",
                                        "image_name": "image_name",
                                        "webserver_port":" webserver_port"
                                    }
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
            if(currentDeployToDelete !== null && !$scope.deleteInProcess) {
                $scope.deleteInProcess = true;
                RestService.deleteDeploymentById({deployment_id: currentDeployToDelete.id, ignoreLiveNodes: $scope.ignoreLiveNodes})
                    .then(function(data){
                        $scope.deleteInProcess = false;
                        if(data.hasOwnProperty('message')) {
                            $scope.delDeployError = data.message;
                        }
                        else {
                            closeDeleteDialog();
                            $timeout(function(){
                                _loadDeployments();
                            }, 500);
                        }
                    });
            }
        }

        $scope.deleteDeployment = function(deployment) {
            currentDeployToDelete = deployment;
            $scope.delDeployError = false;
            $scope.ignoreLiveNodes = false;
            $scope.delDeployName = deployment.id;
            $scope.isDeleteDeploymentVisible = true;
        };

        function closeDeleteDialog() {
            if ($scope.deleteInProcess) {
                return;
            }
            $scope.isDeleteDeploymentVisible = false;
            currentDeployToDelete = null;
        }
        $scope.closeDeleteDialog = closeDeleteDialog;

        $scope.confirmDeleteDeployment = function() {
            deleteDeployment();
        };

        $scope.toggleIgnoreLiveNodes = function() {
            $scope.ignoreLiveNodes = !$scope.ignoreLiveNodes;
        };
    });
