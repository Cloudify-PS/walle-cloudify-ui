'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiApp.directive:sectionNavMenu
 * @description
 * # sectionNavMenu
 *
 *
 * expects <pre>sections</pre> of the following form
 *
 * [
 *    {   href: '__url__', 'active' : true/false , 'name' : '__some_name__' }
 * ]
 *
 *
 */
angular.module('cosmoUiApp')
    .directive('sectionNavMenu', function () {
        return {
            templateUrl: 'views/directives/sectionNavMenu.html',
            restrict: 'A',
            scope: {
                'sections': '=sectionNavMenu'
            },
            link: function postLink(/*scope, element, attrs*/) {

            }
        };
    });
