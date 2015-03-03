'use strict';

angular.module('cosmoUiApp')
    .directive('tooltip', function () {
        return {
            restrict: 'A',
            link: function postLink(scope, element) {
                scope.$watch(function () {
                    console.log(element.prop("tagName"), element);
                    return element.html();
                }, function (val) {
                    element.attr('title', val.replace(/\s/g, ''));
                });
            }
        };
    });
