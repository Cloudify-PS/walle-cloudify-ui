'use strict';

/**
 * @ngdoc service
 * @name cosmoUiAppApp.NodeSearchService
 * @description
 * # NodeSearchService
 * Service in the cosmoUiApp.
 */
angular.module('cosmoUiApp')
    .service('NodeSearchService', function Nodesearchservice($q, CloudifyService, UpdateNodes) {

        var blueprintsList = [];
        var deploymentList = [];
        var nodesList = [];
        var _updateNodes = UpdateNodes.newInstance();

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

        function _getDeploymentsByBlueprintId(id) {
            var deployments = [];
            for(var i in deploymentList) {
                if(deploymentList[i].parent === id) {
                    deployments.push(deploymentList[i]);
                }
            }
            return deployments;
        }

        function _getDeploymentsNodes(deployments) {
            var deferred = $q.defer();
            var result = [];
            var count = 0;

            function getNodes(deploymentId) {
                CloudifyService.getNodes({deployment_id: deploymentId})
                    .then(function(nodes){
                        count++;
                        result = result.concat(nodes);

                        if(count === deployments.length) {
                            deferred.resolve(result);
                        }
                    });
            }

            for(var i in deployments) {
                getNodes(deployments[i].value);
            }
            return deferred.promise;
        }

        function _getDeploymentNodesInstances(deployments) {
            var deferred = $q.defer();
            var result = [];
            var count = 0;

            function getDeploymentNodes(deploymentId) {
                CloudifyService.deployments.getDeploymentNodes({deployment_id: deploymentId})
                    .then(function(nodes){
                        count++;
                        result = result.concat(nodes);

                        if(count === deployments.length) {
                            deferred.resolve(result);
                        }
                    });
            }

            for(var i in deployments) {
                getDeploymentNodes(deployments[i].value);
            }
            return deferred.promise;
        }

        function _filterNodesByType(type, nodesInstances, nodes) {
            var filterNodesInstances = [];

            for(var i in nodesInstances) {
                var instance = nodesInstances[i];
                var node = _findNodeById(instance.node_id, nodes);

                if(node && node.type_hierarchy.join(',').indexOf(type) > -1) {
                    filterNodesInstances.push(instance);
                }
            }

            return $q.all(filterNodesInstances);
        }

        function _findNodeById(id, nodes) {
            for(var i in nodes) {
                if(nodes[i].id === id) {
                    return nodes[i];
                }
            }
            return null;
        }

        function _execute(type, blueprintId, deployments) {
            var deferred = $q.defer();

            if(!deployments.length) {
                deployments = _getDeploymentsByBlueprintId(blueprintId);
            }

            _getDeploymentsNodes(deployments)
                .then(function(nodes){
                    _getDeploymentNodesInstances(deployments)
                        .then(function(instances){
                            _updateNodes.runUpdate(instances, nodes);
                            _filterNodesByType(type, instances, nodes)
                                .then(function(instances){
                                    deferred.resolve(instances);
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
