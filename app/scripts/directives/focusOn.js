'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiApp.directive:focusOn
 * @description
 * # focusOn
 */
angular.module('cosmoUiApp')
    .directive('focusOn', function ($timeout) {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                function focusElement(){
                    $timeout(function() {
                        element[0].focus();
                    });
                }

                if(attrs.focusOn){
                    scope.$watch(function(){
                        return scope[attrs.focusOn];
                    }, function(newValue){
                        if(!!newValue){
                            focusElement();
                            scope[attrs.focusOn] = undefined;
                        }
                    });
                } else{
                    focusElement();
                }
            }
        };
    });
