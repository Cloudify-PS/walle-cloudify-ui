'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiAppApp.directive:floatingNodePanel
 * @description
 * # floatingNodePanel
 */
angular.module('cosmoUiApp')
    .directive('floatingDeploymentNodePanel', function (cloudifyClient, NodeService, UpdateNodes) {
        return {
            templateUrl: 'views/deployment/floatingNodePanel.html',
            restrict: 'EA',
            scope: {
                id: '=depid',
                node: '=node',
                showPanel : '@show',
                nodesList: '=nodesList'
            },
            link: function postLink($scope, element) {

                var _updateNodes = UpdateNodes.newInstance();

                $scope.propSection = 'general';
                $scope.selectedRelationship = '';


                $scope.hideProperties = function(){
                    $scope.node = null;
                };

                function _viewNode(node) {
                    $scope.showProperties = {
                        properties: node.properties,
                        relationships: node.relationships,
                        general: {
                            'name': node.id,
                            'type': node.type
                        }
                    };
                    if($scope.id) {
                        _getInstances(node.id);
                    }
                }

                function _viewRelationship(relationship) {
                    //$scope.selectNodesArr = [];
                    $scope.propSection = 'general';
                    $scope.showProperties = {
                        properties: relationship.properties,
                        general: {
                            'name': relationship.target_id,
                            'type': relationship.type
                        }
                    };
                }

                function _getInstances(nodeId) {
                    $scope.selectNodesArr = [];
                    cloudifyClient.nodeInstances.list($scope.id)
                        .then(function (httpResponse) {
                            var instances = httpResponse.data;
                            _updateNodes.runUpdate(instances, $scope.nodesList);

                            instances.forEach(function (instance) {
                                if (instance.deployment_id === $scope.id) {
                                    if(instance.node_id === nodeId) {
                                        // adding value and label properties so the selectNodesArr can be used in the multiSelectMenu.
                                        instance.value = instance.id;
                                        instance.label = instance.id;
                                        $scope.selectNodesArr.push(instance);
                                    }
                                }
                            });
                        });
                }

                $scope.$watch('node', function(node){
                    // todo - guy - why are we not usgin ng-show instead?? and then here it would be $scope.showPanel = !!newValue. boom, 4 lines less..
                    $scope.showPanel = !!node;
                    if (!!node) {
                        element.show();
                    } else {
                        element.hide();
                    }

                    if(node) {
                        $scope.selectedNode = null;
                        $scope.propSection = 'general';

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

                $scope.nodeSelected = function(node) {
                    $scope.selectedNode = node;
                    if (node !== null) {
                        $scope.showProperties = {
                            properties: node.runtime_properties,
                            relationships: node.relationships,
                            general: {
                                'name': node.id,
                                'type': NodeService.getInstanceType(node, $scope.nodesList),
                                'state': node.state !== null ? node.state : '',
                                'ip': node.runtime_properties !== null ? node.runtime_properties.ip : '',
                                'ip_addresses': node.runtime_properties !== null && node.runtime_properties.hasOwnProperty('ip_addresses') ? node.runtime_properties.ip_addresses.join(', ') : ''
                            }
                        };
                        $scope.propSection = 'general';
                    } else {
                        $scope.propSection = 'general';
                    }
                };

                $scope.showRelationship = function(relationship) {
                    if (relationship === $scope.selectedRelationship) {
                        $scope.selectedRelationship = '';
                    } else {
                        $scope.selectedRelationship = relationship;
                    }
                };

                $scope.getPropertyKeyName = function(key) {
                    var name = key;
                    if (key === 'ip') {
                        name = 'private IP';
                    }
                    if (key === 'ip_addresses') {
                        name = 'public IPs';
                    }
                    return name;
                };

            }
        };
    });
