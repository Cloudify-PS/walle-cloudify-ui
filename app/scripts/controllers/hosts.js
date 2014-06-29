'use strict';

angular.module('cosmoUiApp')
    .controller('HostsCtrl', function ($scope, BreadcrumbsService, RestService, $filter) {

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
                RestService.getNodes({deployment_id: deployment.value})
                    .then(function(nodes) {
                        var _loadMethod = 'getNodeInstances';
                        if (_filter.deployment_id !== undefined) {
                            _loadMethod = 'getDeploymentNodes';
                        }
                        RestService[_loadMethod](_filter)
                            .then(function (instances) {
                                instances.forEach(function(instance) {
                                    nodes.forEach(function(node) {
                                        if (instance.node_id === node.id && node.type_hierarchy.join(',').indexOf('host') > -1) {
                                            $scope.hostsList.push(instance);
                                        }
                                    });
                                });
                            });
                        $scope.filterLoading = false;
                    });
            });
        }

        RestService.loadBlueprints()
            .then(function (data) {
                for (var j in data) {
                    var blueprint = data[j];
                    $scope.blueprintsList.push({'value': blueprint.id, 'label': blueprint.id});
                    for (var i in blueprint.deployments) {
                        var deployemnt = blueprint.deployments[i];
                        _deploymentsList.push({'value': deployemnt.id, 'label': deployemnt.id, 'parent': blueprint.id});
                    }
                }
            });

        $scope.$watch('eventsFilter.blueprints', function(newValue){
            $scope.deploymentsList = $filter('filterListByList')(_deploymentsList, [newValue]);
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
            _execute();
        };

    });
