'use strict';

angular.module('cosmoUiApp')
    .controller('StartExecutionDialogCtrl', function ($scope, cloudifyClient, $timeout, $filter) {

        $scope.executeErrorMessage = null;
        $scope.inputs = {};
        $scope.inputsValid = false;
        var groups;
        var resourcesWatch;
        var scale_compute;

        function isCurrentWorkflowScale(){
            return $scope.workflow.name === 'scale';
        }

        var resourceParameter;
        (function removeScaleResourceParam(workflows){
            var scale = _.find(workflows, {name: 'scale'});
            //supporting backward compatibility using node_id instead of scalable_entity_name
            if(scale){
                resourceParameter = scale.parameters.node_id ? 'node_id' : scale.parameters.scalable_entity_name ? 'scalable_entity_name' : undefined;
                if(resourceParameter){
                    delete scale.parameters[resourceParameter];
                }
            }
        })($scope.deployment.workflows);

        //$scope.deployment.workflows --> expected to exist from parent scope
        $scope.workflowsList = _.map($scope.deployment.workflows, function (w) {
            return {label: w.name, value: w.name};
        });

        $scope.isGetResourcesError = false;
        $scope.getScalingResources = function() {
            if($scope.resources) {
                return;
            }
            $scope.resources = [];
            var setGroup = function(groupLabel, items) {
                if (items.length > 0) {
                    $scope.resources.push({'groupLabel': groupLabel});
                    _.forEach(items, function (item) {
                        $scope.resources.push({'label': item, 'value': item});
                    });
                }
            };
            var failedGettingResources = function(){
                $scope.setErrorMessage($filter('translate')('dialogs.confirm.getScalingResourcesFail'));
                $scope.isGetResourcesError = true;
            };

            if ($scope.deployment.groups) {
                groups = Object.keys($scope.deployment.groups);
                setGroup('Groups', Object.keys($scope.deployment.groups));
            } else {
                cloudifyClient.deployments.get($scope.deployment.id).then(function (deploymentResponse) {
                    groups = Object.keys(deploymentResponse.data.groups);
                    setGroup('Groups', Object.keys(deploymentResponse.data.groups));
                }, failedGettingResources);
            }

            cloudifyClient.nodes.list($scope.deployment.id).then(function (nodesResponse) {
                setGroup('Nodes', _.pluck(nodesResponse.data.items, 'id'));
            }, failedGettingResources);
        };

        $scope.workflowName = null;
        $scope.$watch('workflowName', function () {
            if ($scope.workflowName) {
                $scope.workflow = _.find($scope.deployment.workflows, {name: $scope.workflowName.value});
                $timeout(function(){
                    if($scope.workflowName.value === 'scale' && $scope.isGetResourcesError) {
                        $scope.setErrorMessage($filter('translate')('dialogs.confirm.getScalingResourcesFail'));
                    }
                });
                if(isCurrentWorkflowScale()){
                    resourcesWatch = $scope.$watch('resourceId', function(item){
                        if(!groups || !item){
                            return;
                        }
                        if(groups.indexOf(item.value) !== -1 && $scope.workflow.parameters.scale_compute){
                            scale_compute = scale_compute ||  $scope.workflow.parameters.scale_compute ;
                            delete $scope.workflow.parameters.scale_compute;
                        }
                        if(groups.indexOf(item.value) === -1 && !$scope.workflow.parameters.scale_compute && scale_compute){
                            $scope.workflow.parameters.scale_compute = scale_compute;
                        }
                    });
                }else if(resourcesWatch){
                    resourcesWatch();
                    resourcesWatch = undefined;
                }
            }
        });

        $scope.setErrorMessage = function (msg) {
            if ($scope.workflow) {
                $scope.executeErrorMessage = msg;
            }
        };

        $scope.isExecuteEnabled = function () {
            return !!$scope.inputsValid && !!$scope.workflow && (!isCurrentWorkflowScale() || !!$scope.resourceId);
        };

        $scope.isParamsVisible = function () {
            return $scope.workflow && $scope.workflow.parameters && !_.isEmpty($scope.workflow.parameters);
        };

        $scope.executeWorkflow = function () {
            $scope.inProcess = true;
            var params = JSON.parse($scope.rawString);
            if(isCurrentWorkflowScale()){
                params[resourceParameter] = $scope.resourceId.value;
            }
            cloudifyClient.executions.start($scope.deployment.id, $scope.workflow.name, params)
                .then(function (result) {
                    var data = result.data;
                    $scope.inProcess = false;
                    if (data.hasOwnProperty('message')) {
                        $scope.setErrorMessage(data.message);
                    } else {
                        $scope.closeThisDialog();
                        $scope.onBegin();
                    }
                }, function (e) {
                    $scope.setErrorMessage(e.data.message);
                    $scope.inProcess = false;
                });
        };

    });
