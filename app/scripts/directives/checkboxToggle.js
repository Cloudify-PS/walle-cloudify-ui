'use strict';

angular.module('cosmoUi')
    .directive('checkboxToggle', function () {
        return {
            template: '<div ng-transclude></div>',
            transclude: 'element',
            replace: true,
            restrict: 'A',
            scope: {
                value: '='
            },
            link: function (scope, element/*, attrs*/) {
                console.log(['toggle-checkbox directive', scope.value]);
                element.on('click', 'button', function (e) {
                    try {
                        element.find('*').removeClass('active');
                        scope.$apply(function () {
                            scope.value = $(e.target).addClass('active').attr('value');
                        });

                        console.log(['set new value on scope', scope.value]);
                    } catch (e) {
                        console.log(e);
                    }


                });
                function matchValue() {
                    element.find('*').removeClass('active');
                    element.find('[value=' + scope.value + ']').addClass('active');
                }

                scope.$watch('value', function (/*newValue*/) {
                    matchValue();
                });

                matchValue();
            }
        };
    });
