'use strict';

/** This is a holy-grail implementation **/
/** read more at :
 /** other reference implementations just in case :
 http://fiddle.jshell.net/teresko/EkTVv/show/
 http://alistapart.com/article/holygrail

 Use it wisely
 **/
angular.module('cosmoUiApp')
    .directive('cosmoLayout', function ($routeParams, appConfig) {
        return {
            templateUrl: 'views/cosmoLayoutTemplate.html',
            restrict: 'C',
            transclude: true,
            replace: true,
            link: function postLink(scope) {
                scope.embeded = ($routeParams.hasOwnProperty('embed') && $routeParams.embed === 'true') ? true : false;
                scope.versions = appConfig.versions;
            }
        };
    });
