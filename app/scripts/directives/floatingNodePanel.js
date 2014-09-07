'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiAppApp.directive:floatingNodePanel
 * @description
 * # floatingNodePanel
 */
angular.module('cosmoUiApp')
    .directive('floatingNodePanel', function (RestService) {
        return {
            templateUrl: 'views/floatingNodePanel.html',
            restrict: 'EA',
            scope: {
                id: '=depid',
                node: '=node'
            },
            link: function postLink($scope) {

                $scope.propSection = 'general';

                function _viewNode(node) {
                    $scope.showProperties = {
                        properties: node.properties,
                        relationships: node.relationships,
                        general: {
                            'name': node.id,
                            'type': node.type
                        }
                    };
                    _getInstances(node.id);
                }

                function _getInstances(nodeId) {
                    $scope.selectNodesArr = [];
                    RestService.getNodeInstances()
                        .then(function (instances) {
                            instances.forEach(function (instance) {
                                if (instance.deployment_id === $scope.id) {
                                    if(instance.node_id === nodeId) {
                                        $scope.selectNodesArr.push(instance);
                                    }
                                }
                            });
                        });
                }

                $scope.$watch('node', function(node){
                    if(node) {
                        _viewNode(node);
                    }
                }, true);

                $scope.nodeSelected = function(node) {
                    $scope.selectedNode = node;
                    if (node !== null) {
                        $scope.showProperties = {
                            properties: node.properties,
                            relationships: node.relationships,
                            general: {
                                'name': node.id,
                                'type': node.type,
                                'state': node.runtime_properties !== null ? node.runtime_properties.state : 'N/A',
                                'ip': node.runtime_properties !== null ? node.runtime_properties.ip : 'N/A'
                            }
                        };
                        $scope.propSection = 'general';
                    } else {
                        $scope.propSection = 'general';
                    }
                };

                $scope.hideProperties = function () {
                    $scope.showProperties = null;
                };

                $scope.getPropertyKeyName = function(key) {
                    var name = key;
                    if (key === 'ip') {
                        name = 'private ip';
                    }
                    return name;
                };

            }
        };
    });
