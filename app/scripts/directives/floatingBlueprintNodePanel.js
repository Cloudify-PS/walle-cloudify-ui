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
                nodes: '=nodeLists'
            },
            link: function postLink($scope) {

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

                $scope.$watch('node', function(node){
                    if(node) {
                        _viewNode(node);
                    }
                }, true);

                $scope.hideProperties = function () {
                    $scope.showProperties = null;
                };

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
