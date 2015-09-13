'use strict';

// TODO: this code should be much more testable
angular.module('cosmoUiApp')
    .controller('DeploymentsCtrl', function ($scope, ExecutionsService,
                                             $location, $routeParams, $log,
                                              ngDialog, cloudifyClient ) {

        $scope.deployments = null;
        $scope.executedErr = false;
        $scope.confirmationType = '';

        // holds currently running execution per deployment_id
        var runningExecutions = {};

        $scope.inputs = {};
        $scope.managerError = false;



        $scope.getExecution = function(deployment){
            return _.first(runningExecutions[deployment.id]);
        };

        $scope.canPause = function(deployment_id){
            return ExecutionsService.canPause($scope.getExecution({ id : deployment_id }));
        };

        $scope.isExecuting = function(deployment_id) {
            var execution = $scope.getExecution({'id' : deployment_id});
            return !!execution;
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

            return cloudifyClient.executions.list(null, 'id,workflow_id,status,deployment_id').then(function(result){

                //  CFY-2238 - remove terminated workflows.
                runningExecutions = _.groupBy(_.filter(result.data, function(exec){  return ExecutionsService.isRunning(exec); }), 'deployment_id');

            },function(){
                // todo: implement error handling
            });
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


        $scope.onExecutionStart = function() {
            _loadExecutions();
        };

        $scope.registerTickerTask('deployments/loadExecutions', _loadExecutions, 10000);

        $scope.loadDeployments();


    });
