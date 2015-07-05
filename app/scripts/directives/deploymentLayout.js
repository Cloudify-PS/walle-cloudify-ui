'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiAppApp.directive:deploymentLayout
 * @description
 * # deploymentLayout
 */
angular.module('cosmoUiApp')
    .directive('deploymentLayout', function ($location, BreadcrumbsService, nodeStatus, ngDialog, cloudifyClient, ExecutionsService, $routeParams, $log ) {
        return {
            templateUrl: 'views/deployment/deploymentLayout.html',
            restrict: 'C',
            transclude: true,
            replace: false,
            link: function postLink($scope/*, $element, $attrs*/) {

                $scope.deploymentId = $routeParams.deploymentId;

                // Set Breadcrumb
                BreadcrumbsService.push('deployments', {
                    href: '#/deployments',
                    i18nKey: 'breadcrumb.deployments',
                    id: 'deployments'
                });

                // Set Navigation Menu - Need to set only after blueprint id available for source page href
                $scope.navMenu = [
                    {'name': 'Topology', 'href': '/topology', default: true},
                    {'name': 'Network', 'href': '/network'},
                    {'name': 'Nodes', 'href': '/nodes'},
                    {'name': 'Executions', 'href': '/executions'},
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
                        // Add breadcrumbs for the current deployment
                        BreadcrumbsService.push(
                            {
                                href: false,
                                label: result.data.blueprint_id,
                                brackets: {
                                    label: result.data.blueprint_id,
                                    href: '#/blueprint/' + result.data.blueprint_id + '/topology'
                                },
                                id: 'deployment'
                            }
                        );

                    });

                function _loadExecutions() {
                    return cloudifyClient.executions.list($scope.deploymentId, 'id,workflow_id,status')
                        .then(function (result) {
                            $scope.currentExecution = _.first(_.filter(result.data, function (execution) {
                                return ExecutionsService.isRunning(execution);
                            }));

                            // mock.... remove!!!
                            //$scope.currentExecution = {"status":"started","workflow_id":"uninstall","id":"fa56b8a1-04b5-43b9-894e-8ae4f44321f3"}

                        },
                        function (result) {
                            // todo add proper erorr feedback for user
                            $log.error('unable to get executions', result.data);
                        });
                }




                $scope.$watch('toggleBar', function (toggleBar) {
                    $scope.$emit('toggleChange', toggleBar);
                });


                $scope.isInitializing = function () {
                    return $scope.currentExecution && $scope.currentExecution.workflow_id === 'create_deployment_environment';
                };

                $scope.registerTickerTask('deploymentLayout/loadExecutions', _loadExecutions, 1000);

            }
        };
    });
