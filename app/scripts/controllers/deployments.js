'use strict';

// TODO: this code should be much more testable
angular.module('cosmoUiApp')
    .controller('DeploymentsCtrl', function ($scope, $cookieStore, ExecutionsService,
                                             $location, $routeParams, BreadcrumbsService, $log,
                                             CloudifyService, ngDialog, cloudifyClient, $q) {

        $scope.deployments = null;
        $scope.executedErr = false;
        $scope.confirmationType = '';

        // holds currently running execution per deployment_id
        var runningExecutions = {};

        $scope.selectedWorkflow = {
            data: null
        };

        $scope.inputs = {};
        $scope.managerError = false;
        var selectedWorkflows = [];

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


        $scope.getExecution = function(deployment){
            return runningExecutions[deployment.id];
        };

        $scope.canPause = function(deployment_id){
            return ExecutionsService.canPause(runningExecutions[deployment_id]);
        };

        $scope.isExecuting = function(deployment_id) {
            var execution = runningExecutions[deployment_id];
            return !!execution;
        };

        $scope.isExecuteEnabled = function(deployment_id) {
            return selectedWorkflows[deployment_id] !== undefined;
        };

        $scope.openConfirmationDialog = function(deployment, confirmationType) {
            if (confirmationType === 'execute' && selectedWorkflows[deployment.id] === undefined) {
                return;
            }
            $scope.selectedDeployment = deployment;
            $scope.confirmationType = confirmationType;

            ngDialog.open({
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
            var deferred = $q.defer();

            cloudifyClient.executions.list(null, 'id,workflow_id,status,deployment_id').then(function(result){

                runningExecutions = []; //  CFY-2238 - remove terminated workflows.

                var executions = result.data;
                executions = _.filter(executions, function(exec){  return ExecutionsService.isRunning(exec); });
                _.each(executions, function(exec){
                    runningExecutions[exec.deployment_id] = exec;
                });
                deferred.resolve();
            },function(){
                // todo: implement error handling
            });

            return deferred.promise;
        }

        $scope.loadDeployments = function() {
            cloudifyClient.deployments.list('id,blueprint_id,created_at,updated_at,workflows,inputs,outputs')
                .then(function(result) {

                    $scope.managerError = false;
                    $scope.deployments = result.data;
                },
                function() {
                    $scope.managerError = true;
                });
        };

        $scope.registerTickerTask('deployments/loadExecutions', _loadExecutions, 10000);

        $scope.loadDeployments();

        $scope.deleteDeployment = function(deployment) {

            $scope.itemToDelete = deployment;

            ngDialog.open({
                template: 'views/dialogs/delete.html',
                controller: 'DeleteDialogCtrl',
                scope: $scope,
                className: 'delete-dialog'
            });
        };

        $scope.$on('executionStarted', function() {
            $scope.loadDeployments();
        });

    });
