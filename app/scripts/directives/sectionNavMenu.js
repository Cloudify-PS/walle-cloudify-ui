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
                'sections': '=sectionNavMenu',
                'watch': '='
            },
            link: function postLink(scope/* ,element, attrs*/) {
                scope.setSectionActive = function(section){
                    if(section){
                        var activeSections = _.where(scope.sections,{active:true});
                        activeSections[0].active = false;
                        section.active = true;
                    }
                };

                if(scope.watch) {
                    var unregister = scope.$on('$stateChangeSuccess', function (event, toState) {
                        var section = _.find(scope.sections, function (section) {
                            return _.include(section.href, toState.url);
                        });
                        scope.setSectionActive(section);
                    });

                    scope.$on('$destroy', function () {
                        unregister();
                    });
                }

            }
        };
    });
