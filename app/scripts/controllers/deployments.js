'use strict';

// TODO: this code should be much more testable
angular.module('cosmoUiApp')
    .controller('DeploymentsCtrl', function ($scope, $cookieStore, $location, $routeParams, BreadcrumbsService, $timeout, $log, CloudifyService, ngDialog, cloudifyClient) {

        $scope.deployments = [];
        $scope.executedErr = false;
        $scope.confirmationType = '';
        var _executedDeployments = [];
        $scope.selectedWorkflow = {
            data: null
        };
        $scope.inputs = {};
        $scope.managerError = false;
        var selectedWorkflows = [];
        var workflows = {};
        var _dialog = null;
        $scope.itemToDelete = null;

        BreadcrumbsService.push('deployments',
            {
                href: '#/deployments',
                i18nKey: 'breadcrumb.deployments',
                id: 'deployments'
            });



        $scope.showInputs = function(deployment){
            $log.info('showing inputs');
            var dialogScope = $scope.$new();
            dialogScope.deployment = deployment;
            ngDialog.open(
                {
                    template: 'views/dialogs/deploymentDetails.html' ,
                    controller: 'DeploymentDetailsCtrl',
                    scope: dialogScope
                }
            );
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
            if ( !deployment ){
                return; // no workflows
            }

            if ( !workflows.hasOwnProperty(deployment.id) ){ // construct once
                workflows[deployment.id] = _.map(deployment.workflows, function(w){
                    return {
                        value: w.name,
                        label: w.name,
                        deployment: deployment.id,
                        parameters: w.parameters
                    }
                });

            }

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

        $scope.openConfirmationDialog = function(deployment, confirmationType) {
            if (_isDialogOpen()) {
                return;
            }
            if (confirmationType === 'execute' && selectedWorkflows[deployment.id] === undefined) {
                return;
            }
            $scope.selectedDeployment = deployment;
            $scope.confirmationType = confirmationType;

            _dialog = ngDialog.open({
                template: 'views/dialogs/confirm.html',
                controller: 'ExecuteDialogCtrl',
                scope: $scope,
                className: 'confirm-dialog'
            });
        };

        $scope.redirectTo = function (deployment) {
            $location.path('/deployment/' + deployment.id + '/topology');
        };

        $scope.layerRedirectTo = function(deployment, event, matchElement) {
            if(event.target.tagName.toLowerCase() + '.' + event.target.className === matchElement) {
                $scope.redirectTo(deployment);
            }
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

        $scope.loadDeployments = function() {
            cloudifyClient.deployments.list('id,blueprint_id,created_at,updated_at,workflows')
                .then(function(result) {
                    $scope.managerError = false;

                    $scope.deployments = result.data;

                    _loadExecutions();
                },
                function() {
                    $scope.managerError = true;
                });
        };

        $scope.loadDeployments();

        $scope.deleteDeployment = function(deployment) {
            if (_isDialogOpen()) {
                return;
            }

            $scope.itemToDelete = deployment;

            _dialog = ngDialog.open({
                template: 'views/dialogs/delete.html',
                controller: 'DeleteDialogCtrl',
                scope: $scope,
                className: 'delete-dialog'
            });
        };

        $scope.closeDialog = function() {
            if (_dialog !== null) {
                ngDialog.close(_dialog.id);
            }
            _dialog = null;
        };

        $scope.$on('executionStarted', function() {
            $scope.loadDeployments();
        });

        function _isDialogOpen() {
            return _dialog !== null && ngDialog.isOpen(_dialog.id);
        }
    });
