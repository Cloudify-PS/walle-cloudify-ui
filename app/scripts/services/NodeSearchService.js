'use strict';

/**
 * @ngdoc service
 * @name cosmoUiAppApp.NodeSearchService
 * @description
 * # NodeSearchService
 * Service in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
    .service('NodeSearchService', function Nodesearchservice($q, CloudifyService) {

        var blueprintsList = [];
        var deploymentList = [];
        var nodesList = [];

        (function _initData() {
            CloudifyService.blueprints.list()
                .then(function (data) {
                    for (var j in data) {
                        var blueprint = data[j];
                        blueprintsList.push({'value': blueprint.id, 'label': blueprint.id});
                        for (var i in blueprint.deployments) {
                            var deployemnt = blueprint.deployments[i];
                            deploymentList.push({'value': deployemnt.id, 'label': deployemnt.id, 'parent': blueprint.id});
                        }
                    }
                });
        })();

        function _getBlueprints() {
            return blueprintsList;
        }

        function _getDeployments() {
            return deploymentList;
        }

        function _getNodesList() {
            return nodesList;
        }

        function _execute(type, filter, blueprint_id) {
            var deferred = $q.defer();

            nodesList = [];
            deploymentList.forEach(function(deployment){
                CloudifyService.getNodes({deployment_id: deployment.value})
                    .then(function(nodes) {
                        var _loadMethod;
                        if (filter.deployment_id !== undefined) {
                            _loadMethod = CloudifyService.deployments.getDeploymentNodes(filter);
                        }
                        else {
                            _loadMethod = CloudifyService.getNodeInstances(filter);
                        }
                        _loadMethod.then(function (instances) {
                            if(instances instanceof Array) {
                                instances.forEach(function(instance) {
                                    if(nodes instanceof Array) {
                                        nodes.forEach(function (node) {
                                            if (instance.node_id === node.id && node.type_hierarchy.join(',').indexOf(type) > -1) {
                                                if(!blueprint_id) {
                                                    nodesList.push(instance);
                                                }
                                                else if(blueprint_id === node.blueprint_id) {
                                                    nodesList.push(instance);
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                            deferred.resolve(nodesList);
                        });
                    });
            });

            return deferred.promise;
        }


        this.getBlueprints = _getBlueprints;
        this.getDeployments = _getDeployments;
        this.getNodesList = _getNodesList;
        this.execute = _execute;

    });
