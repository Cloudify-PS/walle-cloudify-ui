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
                'currentExecution' : '=',
                'onNodeSelect': '&',
                'onRelationSelect': '&',
                'trackInstances' : '@'

            },
            link: function postLink(scope) {
                var $scope = scope;


                $scope.topologyLoading = true;
                // for lack of a better word, we are using initialized
                // it means whether there's an execution right now, or all nodes are either deleted or uninitialized.
                // we are trying to let the user know if the system is : 1) changing state, 2) up, 3) down
                // so initialized is everything but down. when down we display no status on deployment
                $scope.initialized = false;


                /*  $scope.getBadgeStatusAndIcon = function(status) {
                 return nodeStatus.getStatusClass(status) + ' ' + nodeStatus.getIconClass(status);
                 };

                 $scope.getBadgeStatus = function(status) {
                 return nodeStatus.getStatusClass(status);
                 };

                 $scope.isConnectedTo = function(relationship) {
                 NodeService.isConnectedTo(relationship);
                 };

                 // TODO: 3.2 - Check if function still needed
                 $scope.getTypeClass = function(type) {
                 return 'cloudify-nodes-' + type;
                 };*/


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

                var blueprint = null;

                var topologyScale = {
                    networkBarLocation: 316,
                    scale: 1,
                    offset: [0, 0]
                };

                $scope.onScaleChange = function(scale,xOffset,yOffset) {
                    topologyScale.offset = [xOffset,yOffset];
                    topologyScale.scale = scale;

                    // Here you can save the scale
                };

                $scope.onNetworkBarChange = function(newYLocation) {
                    topologyScale.networkBarLocation = newYLocation;
                    // Here you can save the scale
                };

                $scope.loadBlueprint = function() {
                    $log.info('getting blueprint');
                    blueprint = cloudifyClient.blueprints.get(scope.blueprintId).then(function (result) {

                        var data = result.data;

                        nodes =data.plan.nodes;


                        var topologyData = _.merge({},topologyScale, {
                            data: data

                        });

                        $scope.topologyData = DataProcessingService.encodeTopologyFromRest(topologyData);
                        $scope.topologyLoading = false;
                        return result;
                    });
                };

                function loadInstances() {
                    if ( !!scope.deploymentId && blueprint  ) {// only poll if blueprint exists and deployment exists
                        return $q.all([blueprint, cloudifyClient.nodeInstances.list(scope.deploymentId)]).then(function (results) {

                            var data = results[0].data;
                            var instances = results[1].data;
                            var executions = $scope.currentExecution;


                            $scope.initialized = $scope.currentExecution || !!_.find(instances, function (i) {
                                return NodeService.status.isInProgress(i);
                            });


                            var topologyData = _.merge({}, topologyScale, {
                                data: data,
                                instances: instances,
                                executions: executions

                            });

                            $rootScope.$broadcast('topology::refresh', DataProcessingService.encodeTopologyFromRest(topologyData) );

                        });
                    }else{
                        return $q.defer().promise;
                    }
                }

                if (!!scope.blueprintId) {
                    $scope.loadBlueprint();
                    // fetch blueprint for painting the topology
                }

                if ( !!$scope.deploymentId ){
                    loadInstances();
                }

                $scope.onNodeSelected = function( node ){

                    if ( node && node.side1 ){ // relation

                        // currently not supported.. need to discuss in 3.4

                    }else{ // node
                        node = { node : _.find(nodes,{id:node.id || node.name}) };
                        if ( !node ){
                            return; // fail silently;
                        }
                        $scope.onNodeSelect(node);
                    }
                };

                //console.log('blueprintId', scope.blueprintId);
                ////
                scope.$watch('blueprintId', function (newValue, oldValue) {/**/
                    if (newValue !== oldValue) {
                        $scope.loadBlueprint();
                    }
                });

                scope.$watch('deploymentId', function(newValue, oldValue){
                    if ( newValue !== oldValue ){
                        loadInstances();
                    }
                });

                $scope.registerTickerTask('deploymentTopology/loadInstances', loadInstances, 1000);
            }
        };
    });
