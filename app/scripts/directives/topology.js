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
    .directive('topology', function (cloudifyClient, NodeService, blueprintCoordinateService, $log) {
        return {
            templateUrl: 'views/directives/topology.html',
            restrict: 'A',
            scope: {
                'blueprintId': '=',
                'deploymentId': '=',
                'onNodeSelect': '&',
                'onRelationSelect': '&'

            },
            link: function postLink(scope) {
                var $scope = scope;


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


                $scope.loadBlueprint = function() {
                    $log.info('getting blueprint');
                    cloudifyClient.blueprints.get(scope.blueprintId).then(function (result) {

                        $log.info('got blueprint');
                        scope.nodes = NodeService.createNodesTree(result.data.plan.nodes);
                        blueprintCoordinateService.resetCoordinates();
                        blueprintCoordinateService.setMap(NodeService.getConnections(result.data.plan.nodes, 'connected_to'));
                        scope.coordinates = blueprintCoordinateService.getCoordinates();

                    });
                };

                $scope.loadInstances = function () {
                    cloudifyClient.nodeInstances.list(scope.deploymentId).then(function (result) {
                        scope.nodeInstances = _.groupBy(result.data,'node_id');
                    })
                };

                if (!!scope.blueprintId) {
                    $scope.loadBlueprint();
                    // fetch blueprint for painting the topology
                }

                if ( !!$scope.deploymentId ){
                    $scope.loadInstances();
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
                        $scope.loadInstances();
                    }
                })


            }
        };
    });
