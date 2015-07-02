'use strict';

angular.module('cosmoUiApp')
    .directive('bpTopologyNodes',  function (RecursionHelper, TopologyTypes, NodeService) {
        return {
            templateUrl: 'views/bpTopologyNodesTemplate.html',
            restrict: 'EA',
            transclude: true,
            scope: {
                map: '=',
                nodeInstances: '=',
                deploymentInProgress: '=',
                onNodeSelect: '&selected',
                onRelationshipSelect: '&'
            },
            compile: function(element) {
                return RecursionHelper.compile(element, function(scope) { });
            },
            controller: function($scope, $element, nodeStatus) {

                var scope = $scope;

                scope.getTotal = function( node ){
                    if ( scope.nodeInstances ) {
                        return scope.nodeInstances[node.id].length;
                    }
                };

                scope.getCompleted = function(){
                    if ( scope.nodeInstances ){
                        return _.filter(scope.nodeInstances[node.id], function(instance){ NodeService.isCompleted(instance);}).length;
                    }
                };

                scope.$watch('nodeInstances', function(){
                    console.log('node intances changed!', $scope.nodeInstances);
                });

                $scope.getBadgeStatusAndIcon = function(status) {
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
                };


                $scope.shouldShowBadge = function (node) {

                    if (node.state === undefined || node.state.completed === undefined) {
                        return false;
                    }

                    if (node.state.status === 0 && !this.currentExecution) {
                        return false;
                    }

                    return true;
                };

                $scope.shouldShowBadgeTitle = function (node) {
                    return !!scope.nodeInstances && !node.isContained;
                };







            }
        };
    });
