'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiAppApp.directive:deploymentLayout
 * @description
 * # deploymentLayout
 */
angular.module('cosmoUiApp')
    .directive('deploymentLayout', function ($location, BreadcrumbsService, CloudifyService, nodeStatus) {
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
                var statesIndex = nodeStatus.getStatesIndex();

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
                $scope.isInitilizingLoader = false;

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

                        _getNodes(dataDeployment.id);
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

                function _getNodes(deployment_id) {
                    // Get Nodes
                    CloudifyService.getNodes({deployment_id: deployment_id})
                        .then(function(dataNodes) {

                            var nodes = [];
                            dataNodes.forEach(function(node) {
                                if (node.deployment_id === deployment_id) {
                                    node.name = node.id;
                                    nodes.push(node);
                                }
                            });
                            nodesList = nodes;

                            // Set Deployment Model
                            _setDeploymentModel(nodesList);
                            // todo - not sure if we need this..
                            //_updateDeploymentModel(nodesList);

                            // Emit nodes data
                            $scope.$emit('nodesList', nodesList);

                            // Emit deployment process data
                            $scope.$emit('deploymentProcess', deploymentModel);

                            _startDeploymentExecutionsAutopull();
                        });
                }

                function _startDeploymentExecutionsAutopull() {
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
                            CloudifyService.deployments.getDeploymentNodes({deployment_id : $scope.id, state: true})
                                .then(function(dataNodes){
                                    // now that we have the instances, we can count how many instances we have per node
                                    // we cannot use "number_of_instances" or "deploy" field, because it does not
                                    // consider parent nodes with multiple instances.
                                    // host A with 2 instances that contains App B with 2 instances will actually
                                    // spawn 4 instances of App B (2 per host).
                                    _.each(deploymentModel, function(value, key){
                                        value.total = 0; // reset count..
                                    });

                                    _.each(dataNodes, function( instance ){
                                        deploymentModel[instance.node_id].total ++;
                                        deploymentModel['*'].total ++;
                                    });


                                    _updateDeploymentModel(dataNodes);
                                });
                            $scope.$emit('deploymentExecution', {
                                currentExecution: $scope.currentExecution,
                                deploymentInProgress: $scope.deploymentInProgress,
                                executionsList: dataExec
                            });
                        });
                }

                function _orderNodesById( nodes ) {
                    var instancesByNodeId =  _.groupBy(nodes, 'node_id');
                    _.each(instancesByNodeId, function(instances, node_id) {
                        instancesByNodeId[node_id] = _.indexBy(instances,'id');
                    });
                    return instancesByNodeId;
                }

                /*
                Updating the model. Grouping node instances by their node id to collect their statuses & update the node statuses in the model.
                 */
                function _updateDeploymentModel( nodes ) {
                    var IndexedNodes = _orderNodesById(nodes);
                    for (var i in deploymentModel) {
                        var _nodeInstanceStatus = deploymentModel[i];   // Node instance status in the model
                        var _reachable = 0;
                        var _states = 0;
                        var _completed = 0;
                        var _uninitialized = 0;

                        // go over all the instances
                        for (var n in _nodeInstanceStatus.instancesIds) {
                            var nodeId = _nodeInstanceStatus.instancesIds[n];

                            if(IndexedNodes.hasOwnProperty(nodeId)) {
                                for (var inst in IndexedNodes[nodeId]) {
                                    var instance = IndexedNodes[nodeId][inst];
                                    var stateNum = statesIndex.indexOf(instance.state);

                                    // Count how many instances are reachable
                                    if(instance.state === 'started') {
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
                        }

                        // * results of all the instances of the node * //
                        // completed instances
                        _nodeInstanceStatus.completed = _completed;

                        // reachable instances
                        _nodeInstanceStatus.reachables = _reachable;

                        // average process
                        _nodeInstanceStatus.state = Math.round(_states / _nodeInstanceStatus.total);

                        // average process in percentage
                        _nodeInstanceStatus.states = calcState(_states, _nodeInstanceStatus.total);

                        // Set Status by Workflow Execution Progress
                        var _processDone = (_nodeInstanceStatus.states < 100 ? _nodeInstanceStatus.states : calcProgress(_nodeInstanceStatus.reachables, _nodeInstanceStatus.total));
                        _nodeInstanceStatus.process = {
                            'done': _processDone
                        };

                        if(_uninitialized === _nodeInstanceStatus.total) {
                            setDeploymentStatus(_nodeInstanceStatus, false);
                        }
                        else {
                            setDeploymentStatus(_nodeInstanceStatus, _processDone);
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
                        deployment.status = 0;
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

                function _setDeploymentModel( data ) {
                    deploymentModel['*'] = angular.copy(deploymentDataModel);
                    for (var nodeId in data) {
                        var node = data[nodeId];
                        if(!deploymentModel.hasOwnProperty(node.id)) {
                            deploymentModel[node.id] = angular.copy(deploymentDataModel);
                        }
                        deploymentModel['*'].instancesIds.push(node.id);
                        deploymentModel[node.id].instancesIds.push(node.id);

                    }
                }

                $scope.$watch('toggleBar', function(toggleBar) {
                    $scope.$emit('toggleChange', toggleBar);
                });

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
