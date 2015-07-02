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
            templateUrl: 'views/deployment/layout.html',
            restrict: 'EA',
            transclude: true,
            replace: true,
            scope: {},
            link: function postLink($scope/*, $element, $attrs*/) {

                $scope.deploymentId = $routeParams.deploymentId;
                $scope.executedData = null;

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
                    nm.href = '/deployment/' + $scope.deploymentId + nm.href
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


                $scope.isSectionActive = function (section) {
                    return section.name === $scope.section ? 'active' : '';
                };

                $scope.goToSection = function (section) {
                    $location.path(section.href);
                };

                function loadInstances() {
                    return cloudifyClient.nodeInstances.list($scope.deploymentId, 'node_id,state')
                        .then(function (result) {
                            // now that we have the instances, we can count how many instances we have per node
                            // we cannot use "number_of_instances" or "deploy" field, because it does not
                            // consider parent nodes with multiple instances.
                            // host A with 2 instances that contains App B with 2 instances will actually
                            // spawn 4 instances of App B (2 per host).
                            $scope.nodeInstances = result;
                            $scope.progress = nodeStatus.calculateProgress($scope.nodeInstances, $scope.currentExecution);
                        });
                }

                function _startDeploymentExecutionsAutopull() {
                    // Workflows & Execution

                    return cloudifyClient.executions.list($scope.deploymentId).then(function (result) {

                            $scope.currentExecution = _.filter(result.data, ExecutionsService.isRunning);

                            $scope.$emit('deploymentExecution', {
                                currentExecution: $scope.currentExecution,
                                deploymentInProgress: !!$scope.currentExecution,
                                executionsList: result.data
                            });
                        },
                        function (/*reason*/) {
                            // getDeploymentExecutions failed. Redirect to deployments screen.
                            $scope.deploymentInProgress = false;
                            $location.path('/deployments');

                        });
                }

                function _loadExecutions() {
                    return cloudifyClient.executions.list($scope.deploymentId, 'id,workflow_id,status,deployment_id')
                        .then(function (result) {
                            $scope.executedData = _.filter(result.data, function (execution) {
                                return ExecutionsService.isRunning(execution)
                            });
                        },
                        function (result) {
                            // todo add proper erorr feedback for user
                            $log.error('unable to get executions', result.data);
                        });
                }




                $scope.$watch('toggleBar', function (toggleBar) {
                    $scope.$emit('toggleChange', toggleBar);
                });

                $scope.$on('executionStarted', function (e, data) {
                    $scope.executedData = data;
                });

                $scope.isInitializing = function () {
                    return $scope.currentExecution && $scope.currentExecution.workflow_id === 'create_deployment_environment';
                };


                $scope.registerTickerTask('deploymentLayout/loadExecutions', _loadExecutions, 10000);
                $scope.registerTickerTask('deploymentLayout/loadInstances', loadInstances, 10000);
            }
        };
    });
