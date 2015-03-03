'use strict';

angular.module('cosmoUiApp')
    .directive('tooltip', function () {
        return {
            restrict: 'A',
            link: function postLink(scope, element) {
                scope.$watch(function () {
                    return element.text();
                }, function (val) {
                    element.attr('title', val.replace(/\s/g, ''));
                });
            }
        };
    });
