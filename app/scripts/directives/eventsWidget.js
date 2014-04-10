'use strict';

angular.module('cosmoUi')
    .directive('eventsWidget', function (EventsMap) {
        return {
            templateUrl: 'views/eventsWidgetTemplate.html',
            restrict: 'EA',
            require: '?ngModel',
            scope: {},
            link: function postLink(scope, element, attrs, ngModel) {

                /*function _reverse(array) {
                    var copy = [].concat(array);
                    return copy.reverse();
                }*/

                scope.widgetOpen = true;
                scope.eventsData = [];

                ngModel.$render = function(){
                    var data = ngModel.$viewValue || false;
                    try {
                        //scope.eventsData = _reverse(data);
                        scope.eventsData = data;
                    } catch(e) {}
                };


                scope.isOpen = function() {
                    return scope.widgetOpen;
                };

                scope.toggleWidget = function() {
                    scope.widgetOpen = !scope.widgetOpen;
                };

                scope.getEventIcon = function(event) {
                    return EventsMap.getEventIcon(event);
                };

                scope.getEventText = function(event) {
                    return EventsMap.getEventText(event);
                };

            }
        };
    });
