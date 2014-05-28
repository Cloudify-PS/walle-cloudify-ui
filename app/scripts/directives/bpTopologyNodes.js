'use strict';

angular.module('cosmoUi')
    .directive('bpTopologyNodes', ['$compile', 'Cosmotypesservice', function (compile, Cosmotypesservice) {
        return {
            templateUrl: 'views/bpTopologyNodesTemplate.html',
            restrict: 'EA',
            scope: {
                map: '='
            },
            link: function postLink(scope, element) {

//
//                function _updateNodes(node) {
//                    if (node === undefined) {
//                        return;
//                    }
//
//                    var nodeHtml = '';
//
//                    for (var i = 0; i < node.length; i++) {
//                        nodeHtml += '<div data-type="' + Cosmotypesservice.getTypeData(node[i].type).name + '" class="box ' + _getContainerClass(node[i].id) + '" blueprint:coordinate="' + node[i].id + '">' +
//                                '<div class="hoverup">' +
//                                    '<div class="buttons no-embed">' +
//                                        '<ul>' +
//                                            '<li data-ng-click="viewNode(' + node[i].id + ')" class="topology-glyph node-details"></li>' +
//                                        '</ul>' +
//                                    '</div>' +
//                                '</div>' +
//                            '<div pie:progress="piProgress2" class="piProgress" size="47">' +
//                                '<div class="circle">' +
//                                    '<i class="icon topology-glyph ' +  scope.indexNodes[node[i].id].type.icon + '"></i>' +
//                                    '<div class="badge">' + scope.indexNodes[node[i].id].general.numOfInstances + '</div>' +
//                                '</div>' +
//                            '</div>';
//
//                        if (node[i].children !== undefined && node[i].children.length > 0) {
//                            var child = _updateNodes(node[i].children);
//                            nodeHtml += '<div class="head">' + scope.indexNodes[node[i].id].name + '</div>'
//                            nodeHtml += '<div class="holder">' + child  + '</div>'
//                        } else {
//                            nodeHtml += '<p>' + scope.indexNodes[node[i].id].name + '</p>';
//                        }
//                        nodeHtml += '</div>';
//                    }
//
//
//                    return nodeHtml;
//                }

                scope.getDataType = function(node) {
                    return Cosmotypesservice.getTypeData(node.type).name;
                };

                scope.getContainerClass = function(node_id) {

                    for (var node in scope.indexNodes) {
                        if (scope.indexNodes[node].id === node_id) {
                            return scope.indexNodes[node].type.baseType.replace('_', '-');
                        }
                    }
                    return '';
                };
            }
        };
    }]);
