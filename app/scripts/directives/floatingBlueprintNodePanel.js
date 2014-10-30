'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiAppApp.directive:floatingBlueprintNodePanel
 * @description
 * # floatingBlueprintNodePanel
 */
angular.module('cosmoUiApp')
    .directive('floatingBlueprintNodePanel', function () {
        return {
            templateUrl: 'views/blueprint/floatingNodePanel.html',
            restrict: 'EA',
            scope: {
                node: '=node',
                nodes: '=nodeLists',
                showPanel : '@show'
            },
            link: function postLink($scope, element) {

                $scope.hideProperties = function(){
                    $scope.node = null;
                };

                $scope.$watch('node', function(newValue) {
                    if (!!newValue) {
                        element.show();
                    } else {
                        element.hide();
                    }
                });

                function _viewNode(node) {
                    $scope.propSection = 'general';
                    $scope.showProperties = {
                        properties: node.properties,
                        relationships: node.relationships,
                        general: {
                            'name': node.id,
                            'type': node.type
                        }
                    };
                }

                function _viewRelationship(relationship) {
                    $scope.propSection = 'general';
                    $scope.showProperties = {
                        properties: relationship.properties,
                        general: {
                            'name': relationship.target_id,
                            'type': relationship.type
                        }
                    };
                }

                $scope.$watch('node', function(node){
                    if(node) {
                        switch(node.nodeType) {
                        case 'node':
                            _viewNode(node);
                            break;
                        case 'relationship':
                            _viewRelationship(node);
                            break;
                        default:
                            _viewNode(node);
                        }
                    }
                }, true);

                $scope.getNodeById = function(nodeId) {
                    angular.forEach($scope.nodes, function(node){
                        if(node.id === nodeId) {
                            _viewNode(node);
                            return;
                        }
                    });
                };

            }
        };
    });
