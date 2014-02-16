'use strict';

angular.module('cosmoUi')
    .controller('DeploymentsCtrl', function ($scope, RestService, $cookieStore, $location, $routeParams, BreadcrumbsService) {

        $scope.blueprints = null;
        $scope.selectedBlueprint = '';
        $scope.executingWorkflow = $cookieStore.get('executingWorkflow');
        $scope.isConfirmationDialogVisible = false;
        var selectedDeployment = null;
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
                    deploymentId: selectedDeployment.id,
                    workflowId: selectedWorkflow
                });
                $cookieStore.remove('deploymentId');
                $cookieStore.put('deploymentId', selectedDeployment.id);
                $cookieStore.put('executingWorkflow', selectedWorkflow);
                $scope.executingWorkflow = selectedWorkflow;
                $scope.redirectTo(selectedDeployment);
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
            return deploymentId === $cookieStore.get('deploymentId');
        };

        $scope.isExecuteEnabled = function() {
            return selectedWorkflow !== null;
        };

        $scope.toggleConfirmationDialog = function(deployment) {
            selectedDeployment = deployment;
            $scope.isConfirmationDialogVisible = $scope.isConfirmationDialogVisible === false;
        };

        $scope.redirectTo = function (deployment) {
            console.log(['redirecting to', deployment]);
            $scope.selectedDeploymentID = deployment.id;
            $location.path('/deployment').search({id: deployment.id});
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

        if ($routeParams.blueprint !== undefined) {
            $scope.showDeployments($routeParams.blueprint.id);
        }
    });
