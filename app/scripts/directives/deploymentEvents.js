'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiAppApp.directive:deploymentEvents
 * @description
 * # deploymentEvents
 */
angular.module('cosmoUiApp')
    .directive('deploymentEvents', function ($log, $filter, EventsService, EventsMap, $document) {
        return {
            templateUrl: 'views/deployment/eventWidget.html',
            restrict: 'EA',
            scope: {
                id: '=deploymentEvents'
            },
            link: function postLink($scope, $element) {

                $scope.events = [];
                $scope.minimizeMode = true;

                var height = 0,
                    minHeight = 70;
                var events = EventsService.newInstance('/backend/events'),
                    troubleShoot = 0,
                    executeRetry = 10,
                    lastAmount = 0;

                function executeEvents() {
                    function _convertDates(data) {
                        for (var i in data) {
                            data[i]._source.timestamp = $filter('dateFormat')(data[i]._source.timestamp, 'yyyy-MM-dd HH:mm:ss');
                        }
                        return data;
                    }

                    function pushLogs(data) {
                        $scope.events = data.concat($scope.events);
                    }

                    events.execute(function (data) {
                        if (data && data.hasOwnProperty('hits')) {
                            var dataHits = _convertDates(data.hits.hits);
                            if (dataHits.length > 0) {
                                if (data.hits.hits.length !== lastAmount) {
                                    pushLogs(dataHits);
                                    lastAmount = dataHits.length;
                                }
                            }
                        }
                        else {
                            $log.info('Cant load events, undefined data.');
                            troubleShoot++;
                        }

                        // Stop AutoPull after 10 failures
                        if (troubleShoot === executeRetry) {
                            events.stopAutoPull();
                        }
                    }, true);
                }

                function filterEvents(field, newValue, oldValue) {
                    if (newValue === null) {
                        return;
                    }
                    if (oldValue !== null && oldValue.value !== null) {
                        events.filter(field, oldValue.value);
                    }
                    if (newValue.value !== null) {
                        events.filter(field, newValue.value);
                    }
                }

                filterEvents('type', {value: 'cloudify_event'}, null);
                filterEvents('context.deployment_id', {value: $scope.id}, null);
                executeEvents();

                $scope.$watch('events', function () {
                    $scope.$broadcast('rebuild:me');
                });

                $scope.getEventIcon = function (event) {
                    return EventsMap.getEventIcon(event);
                };

                $scope.getEventText = function (event) {
                    return EventsMap.getEventText(event);
                };

                $scope.lastEvent = function () {
                    return $scope.events[0];
                };

                $scope.hasLastEvent = function() {
                    if($scope.minimizeMode && $scope.events.length > 0) {
                        return true;
                    }
                    return false;
                };

                $scope.dragIt = function (event) {
                    event.preventDefault();
                    $scope.minimizeMode = false;
                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);
                };

                function toggleIt() {
                    if (height <= minHeight) {
                        $scope.minimizeMode = true;
                        height = 0;
                    }
                    else {
                        $scope.minimizeMode = false;
                    }
                }

                function mousemove(event) {
                    var y = window.innerHeight - event.pageY;
                    var c = $element.find('.containList');
                    var maxHeight = angular.element(document.querySelector('#main-content')).height() - angular.element(document.querySelector('.bpContainer')).position().top - 50;

                    height = y - 70;

                    if (height >= maxHeight) {
                        height = maxHeight;
                    }

                    c.css({
                        height: height + 'px'
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
