'use strict';

angular.module('cosmoUi')
    .controller('DeploymentsCtrl', function ($scope, RestService, $cookieStore, $location, $routeParams, BreadcrumbsService) {

        $scope.blueprints = null;
        $scope.selectedBlueprint = '';
        var selectedWorkflow = null;
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

        $scope.getWorkflows = function(deployment) {
            var plan = JSON.parse(deployment.plan.replace('\\\\n','').replace('\\',''));
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

        $scope.redirectTo = function (deployment) {
            console.log(['redirecting to', deployment]);
            $scope.selectedDeploymentID = deployment.id;
            $location.path('/deployment').search({id: deployment.id});
        };

        $scope.cosmoConnectionOk = function() {
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
