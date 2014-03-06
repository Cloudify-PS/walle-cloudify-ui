'use strict';

angular.module('cosmoUi')
    .controller('DeploymentsCtrl', function ($scope, RestService, $cookieStore, $location, $routeParams, BreadcrumbsService) {

        $scope.blueprints = null;
        $scope.selectedBlueprint = '';
        $scope.executingWorkflow = $cookieStore.get('executingWorkflow');
        $scope.isConfirmationDialogVisible = false;
        $scope.selectedDeployment = null;
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
                }).then(function(execution) {
                    $cookieStore.put('executionId', execution.id);
                });

                $cookieStore.remove('deploymentId');
                $cookieStore.put('deploymentId', $scope.selectedDeployment.id);
                $cookieStore.put('executingWorkflow', selectedWorkflow);
                $scope.executingWorkflow = selectedWorkflow;
                $scope.redirectTo($scope.selectedDeployment);
            }
        };

        $scope.getWorkflows = function(deployment) {
//            var plan = JSON.parse(deployment.plan.replace('\\\\n','').replace('\\',''));
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

        $scope.isExecuting = function(deploymentId) {
            return deploymentId === $cookieStore.get('deploymentId');   // TODO: Use REST API to check execution
        };

        $scope.cancelExecution = function() {
            var callParams = {
                'executionId': $cookieStore.get('executionId'),
                'state': 'cancel'
            };
            RestService.updateExecutionState(callParams).then(function() {
                $cookieStore.remove('deploymentId');
                $cookieStore.remove('executionId');
                $scope.showDeployments($scope.selectedBlueprint);
            });
        };

        $scope.isExecuteEnabled = function() {
            return selectedWorkflow !== null;
        };

        $scope.toggleConfirmationDialog = function(deployment) {
            $scope.selectedDeployment = deployment || null;
            $scope.isConfirmationDialogVisible = $scope.isConfirmationDialogVisible === false;
        };

        $scope.redirectTo = function (deployment) {
            console.log(['redirecting to', deployment]);
            $location.path('/deployment').search({id: deployment.id, blueprintId: deployment.blueprintId});
        };

        $scope.cosmoConnectionError = function() {
            return cosmoError;
        };

        function _loadDeployments() {
            RestService.loadBlueprints()
                .then(function(data) {
                    cosmoError = false;
                    $scope.blueprints = data;
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
