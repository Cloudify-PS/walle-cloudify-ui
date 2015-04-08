'use strict';

angular.module('cosmoUiApp')
    .controller('DeploymentsCtrl', function ($scope, $cookieStore, $location, $routeParams, BreadcrumbsService, $timeout, $log, ngDialog, CloudifyService) {

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
        $scope.inputs = {};
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



        $scope.showInputs = function(deployment){
            $log.info('showing inputs');
            var dialogScope = $scope.$new();
            dialogScope.inputs = deployment.inputs;
            ngDialog.open(
                {
                    template: 'views/dialogs/inputs.html' ,
                    scope: dialogScope
                }
            )
        };

        $scope.executeDeployment = function(deployment) {
            if ($scope.isExecuteEnabled(deployment.id)) {
                CloudifyService.deployments.execute({
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
                return selectedWorkflows[$scope.selectedDeployment.id];
            }
        };

        $scope.isExecuting = function(blueprint_id, deployment_id, workflow) {
            return _executedDeployments[blueprint_id] !== undefined &&
                _executedDeployments[blueprint_id][deployment_id] !== null &&
                _executedDeployments[blueprint_id][deployment_id] !== undefined &&
                _executedDeployments[blueprint_id][deployment_id].status !== 'failed' &&
                _executedDeployments[blueprint_id][deployment_id].status !== 'terminated' &&
                _executedDeployments[blueprint_id][deployment_id].status !== 'cancelled' &&
                _executedDeployments[blueprint_id][deployment_id].status !== null &&
                workflow !== 'create_deployment_environment';
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

        $scope.redirectTo = function (deployment) {
            $location.path('/deployment/' + deployment.id + '/topology');
        };

        $scope.layerRedirectTo = function(deployment, event, matchElement) {
            if(event.target.tagName.toLowerCase() + '.' + event.target.className === matchElement) {
                $scope.redirectTo(deployment);
            }
        };

        $scope.cosmoConnectionError = function() {
            return cosmoError;
        };

        function _loadExecutions() {

            CloudifyService.deployments.getDeploymentExecutions()
                .then(function(data) {
                    if (data.length > 0) {
                        for (var k = 0; k < $scope.deployments.length; k++) {   // running over deployments list
                            var blueprint_id = $scope.deployments[k].blueprint_id;
                            var deployment_id = $scope.deployments[k].id;

                            if (_executedDeployments[blueprint_id] === undefined) { // creating executions array by blueprint name
                                _executedDeployments[blueprint_id] = [];
                            }

                            for (var i = 0; i < data.length; i++) {
                                if (data[i].blueprint_id === blueprint_id && data[i].deployment_id === deployment_id && data[i].status !== null && data[i].status !== 'failed' && data[i].status !== 'terminated' && data[i].status !== 'cancelled') {
                                    selectedWorkflows[deployment_id] = data[i].workflow_id;
                                    _executedDeployments[blueprint_id][deployment_id] = data[i];    // adding execution data by blueprint/deployment id's in executions array

                                } else if (data[i].blueprint_id === blueprint_id && data[i].deployment_id === deployment_id && _executedDeployments[blueprint_id][deployment_id] !== undefined && (data[i].status === 'failed' || data[i].status === 'terminated' || data[i].status === 'cancelled') ){
                                    var currentCreatedDate = new Date(_executedDeployments[blueprint_id][deployment_id].created_at).getTime();
                                    var dataCreatedDate = new Date(data[i].created_at).getTime();

                                    if (currentCreatedDate < dataCreatedDate) {
                                        _executedDeployments[blueprint_id][deployment_id] = null;
                                    }
                                }
                            }
                        }
                    }
                });

            // location path check to prevent timeout from keep running after path was changed to different page
            if ($location.path() === '/deployments') {
                $timeout(function(){
                    _loadExecutions();
                }, 10000);
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
            CloudifyService.blueprints.list()
                .then(function(data) {
                    cosmoError = false;
                    $scope.blueprints = data;
                    $scope.deployments = [];

                    for (var j = 0; j < data.length; j++) {
                        var deployments = data[j].deployments;
                        $scope.deployments = $scope.deployments.concat(data[j].deployments);
                        for (var i = 0; i < deployments.length; i++) {
                            workflows[deployments[i].id] = [];
                            for (var w in deployments[i].workflows) {
                                var workflow = deployments[i].workflows[w];
                                workflows[deployments[i].id].push({
                                    value: workflow.name,
                                    label: workflow.name,
                                    deployment: deployments[i].id,
                                    parameters: workflow.parameters
                                });
                            }
                        }
                    }
                    _loadExecutions();
                },
                function() {
                    cosmoError = true;
                });
        }

        _loadDeployments();

        function deleteDeployment() {
            if(currentDeployToDelete !== null && !$scope.deleteInProcess) {
                $scope.deleteInProcess = true;
                CloudifyService.deployments.deleteDeploymentById({deployment_id: currentDeployToDelete.id, ignoreLiveNodes: $scope.ignoreLiveNodes})
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
