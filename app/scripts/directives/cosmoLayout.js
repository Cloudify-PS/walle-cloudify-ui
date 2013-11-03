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
            templateUrl: 'views/cosmoLayout.html',
            restrict: 'C',
            transclude: true,
            replace: true,
            link: function postLink(scope, element/*, attrs*/) {
                try {
                    var rightPanel = element.find('.right-panel');
                    $('#right-side-menu').remove();
                    $('#left-side-menu').after(rightPanel);
                    rightPanel.attr('id', 'right-side-menu');
                } catch (e) {
                    console.log(e);

                }
            }
        };
    });
