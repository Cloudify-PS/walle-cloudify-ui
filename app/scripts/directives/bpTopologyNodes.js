'use strict';

angular.module('cosmoUiApp')
    .directive('bpTopologyNodes',  function (RecursionHelper) {
        return {
            templateUrl: 'views/bpTopologyNodesTemplate.html',
            restrict: 'EA',
            transclude: true,
            scope: {
                map: '=',
                nodeInstances: '=',
                inProgress: '=',
                initialized:'=', // need to know. if not initialized, don't show badges. busy also means we are initialized.
                onNodeSelect: '&selected',
                onRelationshipSelect: '&'
            },
            compile: function(element) {
                return RecursionHelper.compile(element, function(/*scope*/) { });
            },
            controller: function($scope, $element, NodeService) {

                var scope = $scope;

                scope.getTotal = function( node ){
                    return getInstances(node).length;
                };

                function getInstances(node){
                    if ( !node ){
                        return [];
                    }
                    if ( scope.nodeInstances && scope.nodeInstances.hasOwnProperty(node.id)) {
                        return scope.nodeInstances[node.id];
                    }else{
                        return [];
                    }
                }

                scope.getCompleted = function( node ){
                    return _.filter(getInstances(node), function(instance){ NodeService.status.isCompleted(instance);}).length;
                };


                $scope.isConnectedTo = function(relationship) {
                    NodeService.isConnectedTo(relationship);
                };

                // TODO: 3.2 - Check if function still needed
                $scope.getTypeClass = function(type) {
                    return 'cloudify-nodes-' + type;
                };


                $scope.shouldShowBadge = function () {
                    return scope.initialized;
                };

                $scope.shouldShowBadgeTitle = function (node) {
                    return !!scope.nodeInstances && !node.isContained;
                };

                $scope.getBadgeStatusAndIcon = function( node ){
                    return NodeService.status.getBadgeStatusAndIcon( scope.inProgress, getInstances(node));

                };

                $scope.getBadgeStatus = function( node ){
                    return NodeService.status.getBadgeStatus( scope.inProgress, getInstances(node));
                };

            }
        };
    });
