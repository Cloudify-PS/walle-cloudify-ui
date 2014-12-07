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
        var deploymentsList = [];
        var _updateNodes = UpdateNodes.newInstance();

        // get all data for node search page.
        // we need to iterate over blueprints and deployments and extract the relevant information to construct
        // the select lists etc..
        function _getNodeSearchData(){
            blueprintsList = [];
            deploymentsList = [];
            return CloudifyService.blueprints.list()
                .then(function (blueprints) {
                    blueprintsList = _.map(blueprints, function (blueprint) {
                        return {'value': blueprint.id, 'label': blueprint.id};
                    });

                    _.each(blueprints, function (blueprint) {
                        deploymentsList = deploymentsList.concat(_.map(blueprint.deployments, function (dep) {
                            return {'value': dep.id, 'label': dep.id, 'parent': blueprint.id};
                        }));
                    });

                    return {
                        blueprints: blueprintsList,
                        deployments: deploymentsList
                    };
                });
        }

        function _getDeploymentsByBlueprintId(id) {
            var deployments = [];
            for(var i in deploymentsList) {
                if(deploymentsList[i].parent === id) {
                    deployments.push(deploymentsList[i]);
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

        this.getNodeSearchData = _getNodeSearchData;
        this.execute = _execute;
    });
