'use strict';

angular.module('cosmoUi')
    .directive('bpTopologyNodes', ['$compile', 'Cosmotypesservice', function (compile, Cosmotypesservice) {
        return {
            restrict: 'EA',
            scope: true,
            link: function postLink(scope, element) {

                scope.$watch('map', function(data) {
                    if (data.length > 0) {
//                        element.replaceWith(_updateNodes(data));
                        element.html(_updateNodes(data));
                        compile(element.contents())(scope);
                    }
                });

                function _updateNodes(node) {
                    if (node === undefined) {
                        return;
                    }

                    var nodeHtml = '';

                    for (var i = 0; i < node.length; i++) {
                        var child = _updateNodes(node[i].children);
                        nodeHtml += '<div data-type="' + Cosmotypesservice.getTypeData(node[i].type).name + '" class="box ' + _getContainerClass(node[i].id) + '" blueprint:coordinate="' + node[i].id + '">' +
                                '<div class="hoverup">' +
                                    '<div class="buttons no-embed">' +
                                        '<ul>' +
                                            '<li data-ng-click="viewNode(' + node[i].id + ')" class="topology-glyph node-details"></li>' +
                                        '</ul>' +
                                    '</div>' +
                                '</div>' +
                            '<div pie:progress="piProgress2" class="piProgress" size="47">' +
                                '<div class="circle">' +
                                    '<i class="icon topology-glyph ' +  scope.indexNodes[node[i].id].type.icon + '"></i>' +
                                    '<div class="badge">' + scope.indexNodes[node[i].id].general.numOfInstances + '</div>' +
                                '</div>' +
                            '</div>' +

                            //'<p>' + scope.indexNodes[node[i].id].name + '</p> <!-- module -->' +

                            '<div class="head">' + scope.indexNodes[node[i].id].name + '</  div> <!-- middleware/compute -->' +
                            '<div class="holder">' + child  + '</div>' +
                        '</div>';
                    }
                    return nodeHtml;
                }

                function _getContainerClass(node_id) {

                    for (var node in scope.indexNodes) {
                        if (scope.indexNodes[node].id === node_id) {
                            return scope.indexNodes[node].type.baseType.replace('_', '-');
                        }
                    }
                    return '';
                };

                scope.viewNode = function (node_id) {
                    var realNode = scope.planData.getNode(node_id);
                    scope.showProperties = {
                        properties: scope.planData.getProperties(realNode),
                        relationships: scope.planData.getRelationships(realNode),
                        general: scope.planData.getGeneralInfo(realNode)
                    };
                };
            }
        };
    }]);
