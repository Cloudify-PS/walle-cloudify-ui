'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiAppApp.directive:deploymentEvents
 * @description
 * # deploymentEvents
 */
angular.module('cosmoUiApp')
    .directive('deploymentEvents', function($log, EventsMap, $document, cloudifyClient, $localStorage) {
        return {
            templateUrl: 'views/deployment/deploymentEvents.html',
            restrict: 'EA',
            scope: {
                id: '=deploymentEvents',
                showDeploymentEvents: '='
            },
            link: function postLink($scope, $element) {
                var dragFromY = 0; // indicates which Y value drag started
                var dragFromHeight = 0;
                var $head = $element.find('.head');
                var $list = $element.find('.containList');
                var $topNavbar = angular.element('.navbar-fixed-top');
                var elementOffset = $list[0].getBoundingClientRect().top;
                var topNavbarHeight = $topNavbar.length ? $topNavbar[0].offsetHeight : 0;
                var minHeight = $head[0].offsetHeight;
                var maxHeight = elementOffset - topNavbarHeight - minHeight;

                $scope.events = [];
                $scope.storage = $localStorage;
                $scope.eventsMap = EventsMap;
                $scope.logsSearchParams = {
                    deployment_Id: '{"matchAny":"[\\"' + $scope.id + '\\"]"}',
                    sortBy: 'timestamp',
                    reverseOrder: true
                };
                $scope.dragIt = dragIt;
                $scope.executeEvents = getExecutionEvents;

                $list.height($localStorage.eventsMinimized ? 0 : 267);

                $scope.registerTickerTask('deploymentEvents/events', getExecutionEvents, 3000);

                function dragIt(event) {
                    event.preventDefault();
                    dragFromY = event.clientY;
                    dragFromHeight = $list.height();
                    $localStorage.eventsMinimized = false;
                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);
                }

                function getExecutionEvents() {
                    if (!$scope.id || !$scope.showDeploymentEvents) {
                        return {
                            then: function() { }
                        };
                    }
                    return cloudifyClient.events.get({
                        deployment_id: $scope.id,
                        _offset: 0,
                        _size: 50,
                        _sort: '-@timestamp',
                        type: 'cloudify_event'
                    }).then(function(result) {
                        $scope.events = result.data.items;
                        $scope.lastEvent = _.first($scope.events);
                    }, true);
                }

                function toggle() {
                    $localStorage.eventsMinimized = $list.height() <= minHeight;
                    if ($localStorage.eventsMinimized) {
                        $list.height(0);
                    }
                }

                function mousemove(event) {
                    // clientY increases if mouse is lower on screen.
                    var currentY = event.clientY;
                    var newHeight = dragFromHeight + dragFromY - currentY;

                    newHeight = Math.min(newHeight, maxHeight);
                    newHeight = Math.max(newHeight, 0);

                    $list.css({
                        height: newHeight + 'px'
                    });
                }

                function mouseup() {
                    toggle();
                    $document.unbind('mousemove', mousemove);
                    $document.unbind('mouseup', mouseup);
                }
            }
        };
    });
