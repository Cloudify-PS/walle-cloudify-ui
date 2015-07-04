'use strict';

/** This is a holy-grail implementation **/
/** read more at :
 /** other reference implementations just in case :
 http://fiddle.jshell.net/teresko/EkTVv/show/
 http://alistapart.com/article/holygrail

 Use it wisely
 **/
angular.module('cosmoUiApp')
    .directive('cosmoLayout', function ($routeParams, VersionService, $window) {
        return {
            templateUrl: 'views/cosmoLayoutTemplate.html',
            restrict: 'C',
            transclude: true,
            replace: true,
            link: function postLink(scope, element) {
                scope.embeded = $window !== $window.top;
                if ( $routeParams.hasOwnProperty('embed')  ) { // override
                    scope.embeded = $routeParams.embed === 'true';
                }

                VersionService.getVersions().then(function(versions) {
                    scope.versions = versions;
                });


                $(document).on('scroll', function(){
                    var newValue =  $('body').scrollTop();
                    var $left = $('#left-side-menu');
                    if ( newValue > 80 ){
                        $left.addClass('fix-to-top');
                    }else if ( $('body')[0].scrollHeight > 1000 ){ // fix flicker when  body is small.. this will make the scroll disappear, but at least we will not flicker
                        console.log('removing fixed',newValue,$left.offset().top );
                        $left.removeClass('fix-to-top');
                    }
                });

            }
        };
    });
