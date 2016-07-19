'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiApp.directive:collapsibleText
 * @description
 * # collapsibleText
 */
angular.module('cosmoUiApp')
    .directive('collapsibleText', function ($timeout, $window) {
        return {
            template: '<span>{{text}}</span><a ng-show="isAdjusted === true" ng-click="showMore()">show more</a><a ng-show="isAdjusted === false" ng-click="showLess()">show less</a>',
            restrict: 'E',
            scope:{
                lines: '=',
                text: '='
            },
            link: function postLink(scope, element) {
                var textElement = element.find('span');
                var originalHeight;
                var adjustedHeight;

                //waiting for text to render, then measuring
                $timeout(function(){
                    var lineHeight = parseInt($window.getComputedStyle(textElement[0]).lineHeight);
                    originalHeight = textElement[0].offsetHeight;
                    adjustedHeight = scope.lines * lineHeight;

                    textElement.css('visibility', 'visible');
                    if(adjustedHeight < originalHeight){
                        scope.showLess();
                    }
                });

                scope.showMore = function(){
                    scope.isAdjusted = false;
                    textElement.css('max-height', originalHeight+'px');
                };

                scope.showLess = function(){
                    scope.isAdjusted = true;
                    textElement.css('max-height', adjustedHeight+'px');
                };
            }
        };
    });
