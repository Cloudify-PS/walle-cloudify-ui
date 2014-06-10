'use strict';

angular.module('cosmoUi')
    .directive('bindGraph', function ($compile) {
        return {
            template: '<div></div>',
            scope: {
                graph: '=bindGraph'
            },
            link: function ($scope, $element) {
                $scope.$watch('graph.directive', function (directive) {
                    if (!directive) {
                        return;
                    }
                    var newElem = $compile(directive)($scope.$parent);
                    $element.contents().remove();
                    $element.append(newElem);
                });
            }
        };
    });
