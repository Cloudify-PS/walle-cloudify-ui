'use strict';

// TODO: this code should be much more testable
angular.module('cosmoUiApp')
    .controller('DeploymentsCtrl', function ($scope, ExecutionsService,
                                             $location, $routeParams, $log,
                                             $filter,
                                              ngDialog, cloudifyClient ) {

        $scope.deployments = null;
        $scope.confirmationType = '';

        // holds currently running execution per deployment_id
        var runningExecutions = {};

        $scope.managerError = false;


        $scope.getExecution = function(deployment){
            return _.first(runningExecutions[deployment.id]);
        };

        /*******************************************************************
         *
         *                      Execution Fetching Controls
         *
         *******************************************************************/

        $scope.startedExecutionsOnly = true;

        $scope.getExecutionsDisplayButtonLabel = function(){
            if ( $scope.startedExecutionsOnly ){
                return $filter('translate')('executions.changeFilter.startedOnly');
            }else{
                return $filter('translate')('executions.changeFilter.notStartedOnly');
            }
        };

        $scope.changeExecutionDisplay = function(){
            $scope.startedExecutionsOnly = !$scope.startedExecutionsOnly;
            _loadExecutions();
        };

        /********************************************************************/


        $scope.redirectTo = function (deployment) {
            $location.path('/deployment/' + deployment.id + '/topology');
        };

        $scope.layerRedirectTo = function(deployment, event, matchElement) {
            if(event.target.tagName.toLowerCase() + '.' + event.target.className === matchElement) {
                $scope.redirectTo(deployment);
            }
        };

        function _loadExecutions() {

            var opts = { _include: 'id,workflow_id,status,deployment_id' };

            if ( $scope.startedExecutionsOnly ){
                opts.status = 'started';
            }


            return cloudifyClient.executions.list(  opts ).then(function(result){

                //  CFY-2238 - remove terminated workflows.
                runningExecutions = _.groupBy( _.filter(result.data, ExecutionsService.isRunning) , 'deployment_id');
                debugger;

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

        $scope.registerTickerTask('deployments/loadExecutions', _loadExecutions, 10000);

        $scope.loadDeployments();

        $scope.deleteDeployment = function(deployment) {

            var deleteScope = $scope.$new(true);
            deleteScope.deployment = deployment;
            deleteScope.onDone = $scope.loadDeployments;

            ngDialog.open({
                template: 'views/deployment/deleteDeploymentDialog.html',
                controller: 'DeleteDeploymentDialogCtrl',
                scope: deleteScope,
                className: 'delete-dialog'
            });
        };

    });
