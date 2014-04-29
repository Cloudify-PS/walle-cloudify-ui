'use strict';

angular.module('cosmoUi')
    .directive('dotsLoader', function ($timeout) {
        return {
            templateUrl: 'views/dotsLoaderTemplate.html',
            restrict: 'EA',
            scope: {
                'speed': '='
            },
            link: function postLink(scope, element) {
                scope.positionIndex = 1;
                $timeout(updateDots, scope.speed);

                function updateDots() {
                    element.find('#dotsImg').removeClass('pos-' + scope.positionIndex);
                    scope.positionIndex = scope.positionIndex < 14 ? scope.positionIndex + 1 : 1;
                    element.find('#dotsImg').addClass('pos-' + scope.positionIndex);
                    $timeout(updateDots, scope.speed);
                }
            }
        };
    });
