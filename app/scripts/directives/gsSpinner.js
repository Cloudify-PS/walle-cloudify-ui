'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiApp.directive:gsSpinner
 * @description
 * # gsSpinner
 */
angular.module('cosmoUiApp')
    .directive('gsSpinner', function () {
        return {
            template: '<span><span ng-transclude></span><div class="gs-loader"><i class="fa fa-spinner fa-pulse"></i></div></span>',
            restrict: 'EAC',
            transclude:true,
            replace: false,

            link: function(scope,element,attrs){
                if ( element.is('.large')){

                    element.find('.gs-loader').addClass('large');
                }
                scope.$watch(function(){ return attrs.gsSpinner; }, function(){
                    if ( !attrs || !attrs.gsSpinner || attrs.gsSpinner.length === 0 ){ // empty
                        return;
                    }
                    console.log('this is gsSpinner',attrs.gsSpinner);

                    if ( attrs.gsSpinner === 'true' ){
                        element.addClass('gs-spinner-active');
                    }else{ // 'false'
                        element.removeClass('gs-spinner-active');
                    }
                });
            }
        };
    });
