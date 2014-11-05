'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiAppApp.directive:deploymentLayout
 * @description
 * # deploymentLayout
 */
angular.module('cosmoUiApp')
    .directive('deploymentLayout', function ($location, BreadcrumbsService, CloudifyService) {
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
                var statesIndex = ['uninitialized', 'initializing', 'creating', 'created', 'configuring', 'configured', 'starting', 'started', 'deleted'];

                $scope.breadcrumb = [];
                $scope.workflowsList = [];
                $scope.isConfirmationDialogVisible = false;
                $scope.deploymentInProgress = null;
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
                CloudifyService.deployments.getDeploymentById({deployment_id: $scope.id})
                    .then(function (dataDeployment) {

                        // Verify it's valid page, if not redirect to deployments page
                        if (dataDeployment.hasOwnProperty('error_code')) {
                            $location.path('/deployments');
                        }

                        // Set Deployment ID on Scope
                        $scope.deploymentId = dataDeployment.id;

                        // Emit deployment data
                        $scope.$emit('deploymentData', dataDeployment);

                        // Add breadcrumbs for the current deployment
                        $scope.breadcrumb = [
                            {
                                href: false,
                                label: dataDeployment.id,
                                brackets: {
                                    label: dataDeployment.blueprint_id,
                                    href: '#/blueprint/' + dataDeployment.blueprint_id + '/topology'
                                },
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
                                    deployment: dataDeployment.id,
                                    parameters: workflow.parameters
                                });
                            }
                            $scope.workflowsList = workflows;

                            // Emit workflows data
                            $scope.$emit('workflowsData', workflows);
                        }

                        _loadExecutions();

                        // Get Nodes
                        CloudifyService.getNodes({deployment_id: dataDeployment.id})
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
                        'name': 'Executions',
                        'href': '/executions'
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
                CloudifyService.autoPull('getDeploymentExecutions', $scope.id, CloudifyService.deployments.getDeploymentExecutions)
                    .then(null, null, function (dataExec) {
                        $scope.currentExecution = _getCurrentExecution(dataExec);
                        if (!$scope.currentExecution && $scope.deploymentInProgress) {
                            $scope.deploymentInProgress = false;
                        }
                        else if ($scope.deploymentInProgress === null && $scope.currentExecution !== false) {
                            $scope.deploymentInProgress = true;
                        }
                        CloudifyService.deployments.getDeploymentNodes({deployment_id : $scope.id, state: true}).then(function(dataNodes){
                            _updateDeploymentModel(dataNodes);
                        });
                        $scope.$emit('deploymentExecution', {
                            currentExecution: $scope.currentExecution,
                            deploymentInProgress: $scope.deploymentInProgress,
                            executionsList: dataExec
                        });
                    });

                function _orderNodesById( nodes ) {
                    var IndexedNodes = {};
                    for (var i in nodes) {
                        var node = nodes[i];
                        if(node.hasOwnProperty('node_id')) {
                            IndexedNodes[node.node_id] = {
                                state: node.state
                            };
                        }
                    }
                    return IndexedNodes;
                }

                function _updateDeploymentModel( nodes ) {
                    var IndexedNodes = _orderNodesById(nodes);

                    for (var i in deploymentModel) {
                        var deployment = deploymentModel[i];
                        var _reachable = 0;
                        var _states = 0;
                        var _completed = 0;
                        var _uninitialized = 0;

                        // go over all the instances
                        for (var n in deployment.instancesIds) {
                            var nodeId = deployment.instancesIds[n];

                            if(IndexedNodes.hasOwnProperty(nodeId)) {
                                var nodeInstance = IndexedNodes[nodeId];
                                var stateNum = statesIndex.indexOf(nodeInstance.state);

                                // Count how many instances are reachable
                                if(nodeInstance.state === 'started') {
                                    _reachable++;
                                }

                                // instance state between 'initializing' to 'starting'
                                if(stateNum > 0 && stateNum <= 7) {
                                    _states += stateNum;

                                    // instance 'started'
                                    if(stateNum === 7) {
                                        _completed++;
                                    }
                                }

                                // instance 'uninitialized' or 'deleted'
                                if(stateNum === 0 || stateNum > 7) {
                                    _uninitialized++;
                                }
                            }
                        }

                        // * results of all the instances of the node * //
                        // completed instances
                        deployment.completed = _completed;

                        // reachable instances
                        deployment.reachables = _reachable;

                        // average process
                        deployment.state = Math.round(_states / deployment.total);

                        // average process in percents
                        deployment.states = calcState(_states, deployment.total);

                        // Set Status by Workflow Execution Progress
                        var processDone = (deployment.states < 100 ? deployment.states : calcProgress(deployment.reachables, deployment.total));
                        deployment.process = {
                            'done': processDone
                        };

                        if(_uninitialized === deployment.total) {
                            setDeploymentStatus(deployment, false);
                        }
                        else {
                            setDeploymentStatus(deployment, processDone);
                        }
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

                function _cancelExecution() {
                    var callParams = {
                        'execution_id': $scope.executedData.id,
                        'state': 'cancel'
                    };
                    CloudifyService.deployments.updateExecutionState(callParams).then(function (data) {
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
                        $scope.deploymentInProgress = true;
                        CloudifyService.deployments.execute({
                            deployment_id: $scope.id,
                            workflow_id: $scope.selectedWorkflow.data.value,
                            parameters: $scope.selectedWorkflow.data.parameters
                        }).then(function (execution) {
                            if (execution.hasOwnProperty('error_code')) {
                                $scope.executedErr = execution.message;
                            }
                            else {
                                $scope.currentExecution = execution;
                                $scope.isConfirmationDialogVisible = false;
                            }
                        });
                    }
                }

                function _loadExecutions() {
                    CloudifyService.deployments.getDeploymentExecutions($scope.id)
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

                $scope.isInitilizingLoader = false;
                $scope.isInitilizing = function() {
                    if($scope.currentExecution === null) {
                        return true;
                    }
                    else if($scope.currentExecution.workflow_id === 'create_deployment_environment') {
                        $scope.isInitilizingLoader = true;
                        return true;
                    }
                    $scope.isInitilizingLoader = false;
                    return false;
                };
            }
        };
    });
