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
                var statesIndex = ['uninitialized', 'initializing', 'creating', 'created', 'configuring', 'configured', 'starting', 'started'];

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

                // Emit Selected Workflow
                $scope.$emit('selectedWorkflow', $scope.selectedWorkflow);

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

                        _loadExecutions();

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

                                // Set Deployment Model
                                _setDeploymentModel(nodesList);
                                _updateDeploymentModel(nodesList);

                                // Emit nodes data
                                $scope.$emit('nodesList', nodesList);

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
                        else {
                            RestService.getDeploymentNodes({deployment_id : $scope.id, state: true}).then(function(dataNodes){
                                _updateDeploymentModel(dataNodes);
                            });
                        }
                        $scope.$emit('deploymentExecution', {
                            currentExecution: $scope.currentExecution,
                            deploymentInProgress: $scope.deploymentInProgress
                        });
                    });

                function _updateDeploymentModel( nodes ) {
                    var IndexedNodes = {};
                    for (var i in nodes) {
                        var node = nodes[i];
                        IndexedNodes[node.node_id] = {
                            state: node.state
                        };
                    }
                    for (var d in deploymentModel) {
                        var deployment = deploymentModel[d];
                        var _reachable = 0;
                        var _states = 0;
                        var _completed = 0;

                        for (var n in deployment.instancesIds) {
                            var nodeId = deployment.instancesIds[n];
                            var nodeInstance = IndexedNodes[nodeId];
                            if(IndexedNodes.hasOwnProperty(nodeId)) {
                                if(nodeInstance.state === 'started') {
                                    _reachable++;
                                }
                                if(statesIndex.indexOf(nodeInstance.state) > 0 || statesIndex.indexOf(nodeInstance.state) < 7) {
                                    var stateNum = statesIndex.indexOf(nodeInstance.state);
                                    if(stateNum === 7) {
                                        _completed++;
                                    }
                                    _states += stateNum;
                                }
                            }
                        }
                        deployment.completed = _completed;
                        deployment.reachables = _reachable;
                        deployment.state = Math.round(_states / deployment.total);
                        deployment.states = calcState(_states, deployment.total);

                        // Calculate percents for progressbar
                        var processDone = (deployment.states < 100 ? deployment.states : calcProgress(deployment.reachables, deployment.total));
                        deployment.process = {
                            'done': processDone
                        };

                        // Set Status by Workflow Execution Progress
                        setDeploymentStatus(deployment, $scope.deploymentInProgress ? false : processDone);
                    }

                    nodesList.forEach(function(node) {
                        node.state = deploymentModel[node.id];
                    });

                }

                function setDeploymentStatus(deployment, process) {
                    if(process === false) {
                        deployment.status = 0;
                    }
                    else if(process === 100) {
                        deployment.status = 1;
                    }
                    else if(process > 0 && process < 100) {
                        deployment.status = 2;
                    }
                    else if(process === 0) {
                        deployment.status = 3;
                    }
                }

                function calcState(state, instances) {
                    return Math.round(state > 0 ? (state / instances / 7 * 100) : 0);
                }

                function calcProgress(partOf, instances) {
                    return Math.round(partOf > 0 ? 100 * partOf / instances : 0);
                }

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

                function _loadExecutions() {
                    RestService.getDeploymentExecutions($scope.id)
                        .then(function(data) {
                            if (data.length > 0) {
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i].status !== null && data[i].status !== 'failed' && data[i].status !== 'terminated' && data[i].status !== 'cancelled') {
                                        $scope.executedData = data[i];
                                    }
                                }
                            }
                        });
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
                }

                $scope.$watch('toggleBar', function(toggleBar) {
                    $scope.$emit('toggleChange', toggleBar);
                });

            }
        };
    });
