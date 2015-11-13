'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiAppApp.directive:deploymentLayout
 * @description
 * # deploymentLayout
 */
angular.module('cosmoUiApp')
    .directive('deploymentLayout', function ($location, nodeStatus, cloudifyClient, ExecutionsService, $routeParams) {

        return {
            templateUrl: 'views/deployment/deploymentLayout.html',
            restrict: 'C',
            transclude: true,
            replace: false,
            link: function postLink($scope/*, $element, $attrs*/) {

                var url = $location.url();

                $scope.deploymentId = $routeParams.deploymentId;

                // Set Navigation Menu - Need to set only after blueprint id available for source page href
                $scope.navMenu = [
                    {'name': 'Topology', 'href': '/topology', default: true},
                    {'name': 'Network', 'href': '/network'},
                    {'name': 'Nodes', 'href': '/nodes'},
                    {'name': 'Executions', 'href': '/executions'},
                    {'name': 'Inputs & Outputs', 'href': '/inputs-outputs'},
                    {'name': 'Source', 'href': '/source'},
                    {'name': 'Monitoring', 'href': '/monitoring'}
                ];
                _.each($scope.navMenu, function (nm) {
                    if ( $location.path().indexOf(nm.href) >=0 ){
                        nm.active = true;
                    }
                    nm.href = '#/deployment/' + $scope.deploymentId + nm.href;

                });

                // Get Deployment Data
                cloudifyClient.deployments.get($scope.deploymentId, 'blueprint_id, workflows')
                    .then(function (result) {
                        $scope.blueprintId = result.data.blueprint_id;
                        $scope.deployment = result.data;
                    }, function( result ){
                        if ( result.status === 404 ){
                            $scope.deploymentNotFound = true;
                            $scope.showDeploymentEvents = false;
                        }
                    });

                function _loadExecutions() {
                    if ( $scope.deploymentNotFound ){
                        return { then: function(){} };
                    }
                    var statusFilter = ['pending', 'started', 'cancelling', 'force_cancelling'];
                    return cloudifyClient.executions.list( { deployment_id : $scope.deploymentId, _include: 'id,workflow_id,status', status: statusFilter })
                        .then(function (result) {
                            $scope.currentExecution = _.first(result.data);

                            // mock.... remove!!!
                            //$scope.currentExecution = {"status":"started","workflow_id":"uninstall","id":"fa56b8a1-04b5-43b9-894e-8ae4f44321f3"}
                        }, function() {});
                }


                $scope.isInitializing = function () {
                    return $scope.currentExecution && $scope.currentExecution.workflow_id === 'create_deployment_environment';
                };

                $scope.goToDeployments = function() {
                    if($location.url() === url) {
                        $location.path('/deployments');
                    }
                };

                $scope.registerTickerTask('deploymentLayout/loadExecutions', _loadExecutions, 1000);



                /// for tests

                $scope.loadExecutions = _loadExecutions;

            }
        };
    });
