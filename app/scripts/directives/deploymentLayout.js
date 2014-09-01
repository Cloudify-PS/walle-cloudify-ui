'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiAppApp.directive:deploymentLayout
 * @description
 * # deploymentLayout
 */
angular.module('cosmoUiApp')
    .directive('deploymentLayout', function ($location, $route, BreadcrumbsService, RestService) {
        return {
            templateUrl: 'views/deployment/layout.html',
            restrict: 'EA',
            transclude: true,
            replace: true,
            scope: {
                id: '=depid',
                section: '@',
                selectview: '@'
            },
            link: function postLink($scope/*, $element, $attrs*/) {

                var deploymentDataModel = {
                    'status': -1, // -1 = not executed, 0 = (install) in progress, 1 = (done) all done and reachable, 2 = (alert) all done but half reachable, 3 = (failed) all done and not reachable
                    'state': 0,
                    'states': 0,
                    'completed': 0,
                    'total': 0,
                    'process': 0,
                    'instancesIds': []
                };
                $scope.toggleBar = {
                    'compute': true,
                    'middleware': true,
                    'modules': true,
                    'connections': true
                };
                var deploymentModel = {};
                var nodesList = [];

                $scope.breadcrumb = [];
                $scope.workflowsList = [];
                $scope.isConfirmationDialogVisible = false;
                $scope.deploymentInProgress = false;
                $scope.currentExecution = null;
                $scope.executedData = null;
                $scope.selectedWorkflow = {
                    data: null
                };
                $scope.deployments = deploymentModel;

                // Set Breadcrumb
                BreadcrumbsService.push('deployments', {
                    href: '#/deployments',
                    i18nKey: 'breadcrumb.deployments',
                    id: 'deployments'
                });

                // Get Deployment Data
                RestService.getDeploymentById({deployment_id: $scope.id})
                    .then(function (dataDeployment) {

                        // Verify it's valid page, if not redirect to deployments page
                        if (dataDeployment.hasOwnProperty('error_code')) {
                            $location.path('/deployments');
                        }

                        // Emit deployment data
                        $scope.$emit('deploymentData', dataDeployment);

                        // Add breadcrumbs for the current deployment
                        $scope.breadcrumb = [
                            {
                                href: '#/blueprint?id=' + dataDeployment.blueprint_id,
                                label: dataDeployment.blueprint_id,
                                id: 'blueprint'
                            },
                            {
                                href: '',
                                label: dataDeployment.id,
                                id: 'deployment'
                            }
                        ];

                        if (dataDeployment.hasOwnProperty('workflows')) {
                            var workflows = [];
                            for (var wi in dataDeployment.workflows) {
                                var workflow = dataDeployment.workflows[wi];
                                workflows.push({
                                    value: workflow.name,
                                    label: workflow.name,
                                    deployment: dataDeployment.id
                                });
                            }
                            $scope.workflowsList = workflows;
                        }

                        // Get Nodes
                        RestService.getNodes({deployment_id: dataDeployment.id})
                            .then(function(dataNodes) {

                                var nodes = [];
                                dataNodes.forEach(function(node) {
                                    if (node.deployment_id === dataDeployment.id) {
                                        node.name = node.id;
                                        nodes.push(node);
                                    }
                                });
                                nodesList = nodes;

                                // Emit nodes data
                                $scope.$emit('nodesData', dataNodes, nodesList);

                                // Set Deployment Model
                                _setDeploymentModel(nodesList);

                                // Emit deployment process data
                                $scope.$emit('deploymentProcess', deploymentModel);

                            });

                    });

                $scope.$watch('breadcrumb', function (breadcrumbs) {
                    angular.forEach(breadcrumbs, function (breadcrumb) {
                        BreadcrumbsService.push('deployments', breadcrumb);
                    });
                }, true);

                // Set Navigation Menu
                $scope.navMenu = [
                    {
                        'name': 'Topology',
                        'href': '/topology'
                    },
                    {
                        'name': 'Network',
                        'href': '/network'
                    },
                    {
                        'name': 'Nodes',
                        'href': '/nodes'
                    },
                    {
                        'name': 'Events',
                        'href': '/events'
                    },
                    {
                        'name': 'Monitoring',
                        'href': '/monitoring'
                    }
                ];

                $scope.isSectionActive = function (section) {
                    return section.name === $scope.section ? 'active' : '';
                };

                $scope.goToSection = function (section) {
                    $location.path('/deployment/' + $scope.id + section.href);
                };

                // Topology Settings
                $scope.toggleBar = {
                    'compute': true,
                    'middleware': true,
                    'modules': true,
                    'connections': true
                };

                // Workflows & Execution
                RestService.autoPull('getDeploymentExecutions', $scope.id, RestService.getDeploymentExecutions)
                    .then(null, null, function (dataExec) {
                        $scope.currentExecution = _getCurrentExecution(dataExec);
                        if (!$scope.currentExecution && $scope.deploymentInProgress) {
                            $scope.deploymentInProgress = false;
                        }
                        else if ($scope.deploymentInProgress === null || $scope.currentExecution !== false) {
                            $scope.deploymentInProgress = true;
                        }
                        $scope.$emit('deploymentExecution', {
                            currentExecution: $scope.currentExecution,
                            deploymentInProgress: $scope.deploymentInProgress
                        });
                    });

                function _getCurrentExecution(executions) {
                    for (var i in executions) {
                        var execution = executions[i];
                        if (execution.status !== 'failed' && execution.status !== 'terminated' && execution.status !== 'cancelled') {
                            return execution;
                        }
                    }
                    return false;
                }

                function _isExecuteEnabled() {
                    return $scope.selectedWorkflow.data !== null;
                }

                function _refreshPage() {
                    $route.reload();
                }

                function _cancelExecution() {
                    var callParams = {
                        'execution_id': $scope.executedData.id,
                        'state': 'cancel'
                    };
                    RestService.updateExecutionState(callParams).then(function (data) {
                        if (data.hasOwnProperty('error_code')) {
                            $scope.executedErr = data.message;
                        }
                        else {
                            $scope.executedData = null;
                            _toggleConfirmationDialog();
                        }
                    });
                }

                function _executeDeployment() {
                    if (_isExecuteEnabled()) {
                        RestService.executeDeployment({
                            deployment_id: $scope.id,
                            workflow_id: $scope.selectedWorkflow.data.value
                        }).then(function (execution) {
                            if (execution.hasOwnProperty('error_code')) {
                                $scope.executedErr = execution.message;
                            }
                            else {
                                $scope.currentExecution = execution;
                                _refreshPage();
                            }
                        });
                    }
                }

                function _toggleConfirmationDialog(confirmationType) {
                    if (confirmationType === 'execute' && $scope.selectedWorkflow.data === null) {
                        return;
                    }
                    $scope.confirmationType = confirmationType;
                    $scope.isConfirmationDialogVisible = !$scope.isConfirmationDialogVisible;
                    $scope.executedErr = false;
                }

                $scope.isExecuteEnabled = _isExecuteEnabled;
                $scope.toggleConfirmationDialog = _toggleConfirmationDialog;
                $scope.confirmConfirmationDialog = function () {
                    if ($scope.confirmationType === 'execute') {
                        _executeDeployment();
                    } else if ($scope.confirmationType === 'cancel') {
                        _cancelExecution();
                    }
                };

                function _setDeploymentModel( data ) {
                    deploymentModel['*'] = angular.copy(deploymentDataModel);
                    for (var nodeId in data) {
                        var node = data[nodeId];
                        if(!deploymentModel.hasOwnProperty(node.id)) {
                            deploymentModel[node.id] = angular.copy(deploymentDataModel);
                        }
                        deploymentModel['*'].instancesIds.push(node.id);
                        deploymentModel['*'].total += parseInt(node.number_of_instances, 10);
                        deploymentModel[node.id].instancesIds.push(node.id);
                        deploymentModel[node.id].total += parseInt(node.number_of_instances, 10);
                    }

                    console.log(['deploymentModel', deploymentModel]);
                }

                $scope.$watch('toggleBar', function(toggleBar) {
                    $scope.$emit('toggleChange', toggleBar);
                });

            }
        };
    });
