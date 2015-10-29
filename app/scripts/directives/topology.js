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
    .directive('uiTopology', function (cloudifyClient, NodeService, blueprintCoordinateService, $log, $q ) {
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


                var nodes = [];
                $scope.loadBlueprint = function() {
                    $log.info('getting blueprint');
                    cloudifyClient.blueprints.get(scope.blueprintId).then(function (result) {

                        var data = result.data;

                        nodes = data.plan.nodes;
                        var topologyData = {
                            data: data,
                            networkBarLocation: 316,
                            scale: 1,
                            offset: [0, 0]
                        };

                        $scope.topologyData = DataProcessingService.encodeTopologyFromRest(topologyData);
                        $scope.topologyLoading = false;
                    });
                };

                function loadInstances() {
                    if ( !!scope.deploymentId ) {
                        return cloudifyClient.nodeInstances.list(scope.deploymentId).then(function (result) {
                            $scope.initialized = $scope.currentExecution || !!_.find(result.data, function (i) {
                                return NodeService.status.isInProgress(i);
                            });
                            scope.nodeInstances = _.groupBy(result.data, 'node_id');
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
