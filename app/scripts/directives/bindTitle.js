'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiApp.directive:bindTitle
 * @description
 * # bindTitle
 *
 * @param bindTitle
 * @type boolean
 * @description should watch for changes?
 */
angular.module('cosmoUiApp')
    .directive('bindTitle', function ($interpolate) {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                var bindTitle = scope.$eval(attrs.bindTitle);
                function getInterpolatedText(){
                    return $interpolate(element.text())(scope);
                }

                element.attr('title',getInterpolatedText());

                if(bindTitle === true){
                    var listener = scope.$watch(getInterpolatedText,function(newValue){
                        element.attr('title',newValue);
                    });
                    scope.$on('$destroy',function(){
                        listener();
                    });
                }
            }
        };
    });
