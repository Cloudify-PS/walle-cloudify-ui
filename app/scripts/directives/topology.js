'use strict';

/**
 *
 * @module blueprintTopology
 *
 * @description This directive encapsulates all logic required for displaying the topology.
 * this directives also fetches information and calculates deployment progress if one needed.
 *
 * @ngdoc directive
 * @name cosmoUiApp.directive:blueprintTopology
 * @description
 * # blueprintTopology
 */
angular.module('cosmoUiApp')
    .directive('uiTopology', function (cloudifyClient, NodeService, blueprintCoordinateService, DataProcessingService, $log, $q, $rootScope ) {
        return {
            templateUrl: 'views/directives/topology.html',
            restrict: 'A',
            scope: {
                'blueprintId': '=',
                'deploymentId': '=',
                'currentExecution': '=',
                'onNodeSelect': '&',
                'onRelationSelect': '&',
                'trackInstances': '@'

            },
            link: function postLink(scope, elem, attrs) {
                scope.topologyLoading = true;
                // for lack of a better word, we are using initialized
                // it means whether there's an execution right now, or all nodes are either deleted or uninitialized.
                // we are trying to let the user know if the system is : 1) changing state, 2) up, 3) down
                // so initialized is everything but down. when down we display no status on deployment
                scope.initialized = false;

                /**
                 * @typedef {object} TopologyItem
                 * @property {string} id - an identifier
                 */

                /**
                 * We use a cached version of the nodes because the topology will modify them
                 * and we get an error of infinite loop.
                 *
                 * @type {Array<TopologyItem>}
                 */
                var nodes = [];

                var topologyScale = {
                    networkBarLocation: 316,
                    scale: 1,
                    offset: [0, 0]
                };

                scope.onScaleChange = function (scale, xOffset, yOffset) {
                    topologyScale.offset = [xOffset, yOffset];
                    topologyScale.scale = scale;

                    // Here you can save the scale
                };

                scope.onNetworkBarChange = function (newYLocation) {
                    topologyScale.networkBarLocation = newYLocation;
                    // Here you can save the scale
                };

                scope.loadBlueprint = function () {

                    if (!attrs.deploymentId) {

                        $log.info('getting blueprint');
                        cloudifyClient.blueprints.get(scope.blueprintId).then(function (result) {

                            var data = result.data;

                            nodes = data.plan.nodes;


                            var topologyData = _.merge({}, topologyScale, {
                                data: data
                            });

                            scope.topologyData = DataProcessingService.encodeTopologyFromRest(topologyData);
                            scope.topologyLoading = false;
                            return result;
                        });
                    }
                };

                function loadInstances() {

                    if (scope.blueprintId && scope.deploymentId) {

                        return $q.all([cloudifyClient.blueprints.get(scope.blueprintId), cloudifyClient.nodeInstances.list(scope.deploymentId)]).then(function (results) {

                            var data = results[0].data;
                            var instances = results[1].data.items;
                            var executions = scope.currentExecution;
                            var topologyData = _.merge({}, topologyScale, {
                                data: data,
                                instances: instances,
                                executions: executions
                            });

                            scope.initialized = scope.currentExecution || !!_.find(instances, function (i) {
                                    return NodeService.status.isInProgress(i);
                                });

                            if (scope.topologyData) {
                                $rootScope.$broadcast('topology::refresh', DataProcessingService.encodeTopologyFromRest(topologyData));
                            } else {
                                scope.topologyData = DataProcessingService.encodeTopologyFromRest(topologyData);
                                scope.topologyLoading = false;
                            }
                        });

                    } else {
                        return $q.defer().promise;
                    }
                }

                scope.onNodeSelected = function (node) {

                    if (node && node.side1) { // relation

                        // currently not supported.. need to discuss in 3.4

                    } else { // node
                        node = {node: _.find(nodes, {id: node.name})};
                        if (!node || !node.node) {
                            return; // fail silently;
                        }
                        scope.onNodeSelect(node);
                    }
                };


                scope.$watch('blueprintId', scope.loadBlueprint);

                scope.$watch('deploymentId', loadInstances);

                scope.registerTickerTask('deploymentTopology/loadInstances', loadInstances, 1000);
            }
        };
    });
