'use strict';

angular.module('cosmoUi')
    .directive('bpTopologyNodes', ['$compile', 'Cosmotypesservice', function (compile, Cosmotypesservice) {
        return {
            templateUrl: 'views/bpTopologyNodesTemplate.html',
            restrict: 'EA',
            scope: {
                map: '='
            },
            link: function postLink(scope) {

//                scope.$watch('map', function(data) {
//                    console.log(data);
//                });

                scope.getDataType = function(node) {
                    return Cosmotypesservice.getTypeData(node.type).name;
                };

                scope.getContainerClass = function(node) {
                    return node.type.baseType.replace('_', '-');
                };
            }
        };
    }]);
