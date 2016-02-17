'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiAppApp.directive:deploymentEvents
 * @description
 * # deploymentEvents
 */
angular.module('cosmoUiApp')
    .directive('deploymentEvents', function ($log, EventsMap, $document, cloudifyClient) {
        return {
            templateUrl: 'views/deployment/deploymentEvents.html',
            restrict: 'EA',
            scope: {
                id: '=deploymentEvents',
                showDeploymentEvents: '='
            },
            link: function postLink($scope, $element) {

                $scope.events = [];
                $scope.minimizeMode = false;
                $scope.logsSearchParams =
                {
                    deployment_Id: '{"matchAny":"[\\"' + $scope.id + '\\"]"}',
                    sortBy: 'timestamp',
                    reverseOrder: true
                };

                var dragFromY = 0; // indicates which Y value drag started
                var dragFromHeight = 0;
                var minHeight = 40;

                function executeEvents() {

                    if (!$scope.id || !$scope.showDeploymentEvents) {
                        return {
                            then: function () {
                            }
                        };
                    }
                    return cloudifyClient.events.get({
                        'deployment_id': $scope.id,
                        '_offset': 0,
                        '_size': 50,
                        _sort: '-@timestamp',
                        'type': 'cloudify_event'
                    }).then(function (result) {
                        $scope.events = result.data.items;
                        $scope.lastEvent = _.first($scope.events);
                        //Formatting the timestamp
                        _.each($scope.events, function (event) {
                            event.formattedTimestamp = EventsMap.getFormattedTimestamp(event['@timestamp']);
                        });
                    }, true);
                }

                $scope.registerTickerTask('deploymentEvents/events', executeEvents, 3000);

                // todo : get rid of this. replace with scope binding on directive
                $scope.$watch('events', function () {
                    $scope.$broadcast('rebuild:me');
                });

                // todo: use a directive for both instead of adding logic here..
                $scope.getEventIcon = function (event) {
                    return EventsMap.getEventIcon(event);
                };

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
                    } else {
                        $scope.minimizeMode = false;
                    }
                }

                function mousemove(event) {
                    var currentY = event.clientY; // clientY increases if mouse is lower on screen.
                    var newHeight = dragFromHeight + dragFromY - currentY;

                    var c = $element.find('.containList');

                    //measuring element position and height(together creating the element lowest point) minus the header padding and the element height
                    var headerPadding = parseInt($('.main-content').css('top').substr(0,2)) -1;
                    var closedWidgetHeight = parseInt($element.find('.head').css('height').substr(0,2));
                    var elementOffset = $element.children().height() + $element.children().position().top;
                    var maxHeight = (elementOffset) - (headerPadding + closedWidgetHeight);
                    newHeight = Math.min(newHeight, maxHeight);

                    c.css({
                        height: newHeight + 'px'
                    });
                }

                function mouseup() {
                    toggleIt();
                    $document.unbind('mousemove', mousemove);
                    $document.unbind('mouseup', mouseup);
                }

                /// for tests
                $scope.executeEvents = executeEvents;
            }
        };
    });
