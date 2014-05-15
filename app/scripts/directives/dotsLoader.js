'use strict';

angular.module('cosmoUi')
    .directive('dotsLoader', function () {
        return {
            templateUrl: 'views/dotsLoaderTemplate.html',
            restrict: 'EA',
            scope: {
                'speed': '='
            },
            link: function postLink(scope, element) {
                var positionIndex = 1;
                var _speed = scope.speed || 150;

                function updateDots() {
                    var elm = element.find('#dotsImg');
                    var nextIndex = (positionIndex + 1) % 13 + 1;
                    elm.removeClass('pos-' + positionIndex).addClass('pos-' + nextIndex);
                    positionIndex = nextIndex;
                }

                setInterval(updateDots, _speed);
            }
        };
    });
