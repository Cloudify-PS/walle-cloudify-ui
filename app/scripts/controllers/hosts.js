'use strict';

angular.module('cosmoUiApp')
    .controller('HostsCtrl', function ($scope, BreadcrumbsService, $filter, CloudifyService) {

        /**
         * Breadcrumbs
         */
        BreadcrumbsService.push('hosts', {
            href: '#/hosts',
            i18nKey: 'breadcrumb.hosts',
            id: 'hosts'
        });


        /**
         * Hosts
         */
        var _deploymentsList = [];
        var _filter = {};
        var blueprintsByDeployments = {};
        var _filterBlueprint = null;
        $scope.hostsList = [];
        $scope.blueprintsList = [];
        $scope.deploymentsList = [];
        $scope.filterLoading = false;
        $scope.eventsFilter = {
            'blueprints': null,
            'deployments': null
        };

        function _execute() {
            $scope.filterLoading = true;
            $scope.hostsList = [];
            _deploymentsList.forEach(function(deployment) {
                CloudifyService.getNodes({deployment_id: deployment.value})
                    .then(function(nodes) {
                        var _loadMethod;
                        if (_filter.deployment_id !== undefined) {
                            _loadMethod = CloudifyService.deployments.getDeploymentNodes(_filter);
                        }
                        else {
                            _loadMethod = CloudifyService.getNodeInstances(_filter);
                        }
                        _loadMethod.then(function (instances) {
                                if(instances instanceof Array) {
                                    instances.forEach(function(instance) {
                                        if(nodes instanceof Array) {
                                            nodes.forEach(function (node) {
                                                if (instance.node_id === node.id && node.type_hierarchy.join(',').indexOf('host') > -1) {
                                                    if(_filterBlueprint !== null && _filterBlueprint === node.blueprint_id) {
                                                        $scope.hostsList.push(instance);
                                                    }
                                                    else if(_filterBlueprint === null) {
                                                        $scope.hostsList.push(instance);
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        $scope.filterLoading = false;
                    });
            });
        }

        CloudifyService.blueprints.list()
            .then(function (data) {
                for (var j in data) {
                    var blueprint = data[j];
                    $scope.blueprintsList.push({'value': blueprint.id, 'label': blueprint.id});
                    for (var i in blueprint.deployments) {
                        var deployemnt = blueprint.deployments[i];
                        _deploymentsList.push({'value': deployemnt.id, 'label': deployemnt.id, 'parent': blueprint.id});
                        blueprintsByDeployments[deployemnt.id] = blueprint.id;
                    }
                }
            });

        $scope.getBlueprintByDeployment = function(deployment_id) {
            if(blueprintsByDeployments.hasOwnProperty(deployment_id)) {
                return blueprintsByDeployments[deployment_id];
            }
            return null;
        };

        $scope.$watch('eventsFilter.blueprints', function(newValue){
            if(newValue !== null) {
                $scope.deploymentsList = $filter('filterListByList')(_deploymentsList, [newValue]);
                _filterBlueprint = newValue.value;
            }
            else {
                $scope.deploymentsList = [];
                _filterBlueprint = null;
            }
        }, true);

        $scope.$watch('eventsFilter.deployments', function(newValue){
            if(newValue !== null) {
                _filter = {
                    'deployment_id': newValue.value
                };
            } else {
                _filter = {};
            }
        }, true);

        $scope.execute = function() {
            if (!$scope.isSearchDisabled()) {
                _execute();
            }
        };

        $scope.isSearchDisabled = function() {
            return $scope.eventsFilter.blueprints === null || $scope.eventsFilter.blueprints.length === 0;
        };

    });
