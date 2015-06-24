'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiAppApp.directive:deploymentEvents
 * @description
 * # deploymentEvents
 */
angular.module('cosmoUiApp')
    .directive('deploymentEvents', function ($log, $filter, EventsService, EventsMap, $document, cloudifyClient, $interval) {
        return {
            templateUrl: 'views/deployment/eventWidget.html',
            restrict: 'EA',
            scope: {
                id: '=deploymentEvents'
            },
            link: function postLink($scope, $element) {

                $scope.events = [];
                $scope.minimizeMode = false;

                var dragFromY = 0; // indicates which Y value drag started
                var dragFromHeight = 0;
                var minHeight = 40;

                function executeEvents() {

                    cloudifyClient.events.get( { 'deployment_id' :  $scope.id ,  'from_event': 0, 'batch_size' : 50 , 'include_logs' :  false , 'order' : 'desc' }).then(function (result) {
                        $scope.events = result.data.hits.hits;
                        $scope.lastEvent = $scope.events.length > 0 ? $scope.events[0] : null;
                        _.each($scope.events, function(e){
                            e._source.timestamp = EventsService.convertTimestamp( e._source.timestamp  );
                        });
                    }, true);
                }

                // todo: use the polling service
                var polling = $interval(executeEvents, 5000);
                $scope.$on('$destroy', function() {
                    if (polling) {
                        $interval.cancel(polling);
                    }
                });
                executeEvents();


                // todo : get rid of this. replace with scope binding on directive
                $scope.$watch('events', function () {
                    $scope.$broadcast('rebuild:me');
                });

                // todo: use a directive for both instead of adding logic here..
                // todo use EventsService to get the icon instead
                $scope.getEventIcon = function (event) {
                    return EventsMap.getEventIcon(event);
                };

                // todo use EventsService to get the text instead
                $scope.getEventText = function (event) {
                    return EventsMap.getEventText(event);
                };

                $scope.dragIt = function (event) {

                    event.preventDefault();
                    $scope.minimizeMode = false;
                    dragFromY = event.clientY;
                    dragFromHeight = $element.find('.containList').height();
                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);
                };

                function toggleIt() {
                    if ($element.find('.containList').height() <= minHeight) {
                        $log.debug('minimizeMode is on');
                        $scope.minimizeMode = true;
                    }
                    else {
                        $scope.minimizeMode = false;
                    }
                }

                function mousemove(event) {
                    var currentY = event.clientY; // clientY increases if mouse is lower on screen.

                    var newHeight = dragFromHeight + dragFromY - currentY;

                    var c = $element.find('.containList');
                    var maxHeight = angular.element(document.querySelector('#main-content')).height() - angular.element(document.querySelector('.bpContainer')).position().top - 50;

                    if (newHeight >= maxHeight) {
                        newHeight = maxHeight;
                    }

                    c.css({
                        height: newHeight + 'px'
                    });
                }

                function mouseup() {
                    toggleIt();
                    $scope.$broadcast('rebuild:me');
                    $document.unbind('mousemove', mousemove);
                    $document.unbind('mouseup', mouseup);
                }
            }
        };
    });
