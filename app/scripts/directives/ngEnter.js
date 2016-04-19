'use strict';

angular.module('cosmoUiApp')
    .directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind('keydown keypress', function (event) {
                if (event.which === 13 && event.currentTarget === element[0]) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });
                    event.stopPropagation();
                    event.preventDefault();
                }
            });
        };
    });
