'use strict';

/** This is a holy-grail implementation **/
/** read more at :
 /** other reference implementations just in case :
 http://fiddle.jshell.net/teresko/EkTVv/show/
 http://alistapart.com/article/holygrail

 Use it wisely
 **/
angular.module('cosmoUi')
    .directive('cosmoLayout', function () {
        return {
            template: '<div style="height:100%;"><div class="layout"> ' +
                '<div id="header"></div>' +
                '<div id="left-side-menu">' +
                '<div side-menu class="side-menu"></div>' +
                '</div>' +
                '<div id="right-side-menu"></div>' +
                '<div id="main-content">' +
                '<div id="main-content-panel" ng-transclude></div>' +
                '</div>' +
                '<div id="fix"></div>' + // a fix for footer position.
                '</div>' + // layout end
                '<div id="footer"></div></div>',
            restrict: 'C',
            transclude: true,
            replace:true,
            link: function postLink(/*scope, element, attrs*/) {

            }
        };
    });
