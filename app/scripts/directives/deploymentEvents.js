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

                var dragFromY = 0; // indicates which Y value drag started
                var dragFromHeight = 0;
                var minHeight = 40;

                function executeEvents() {

                    if ( !$scope.id || !$scope.showDeploymentEvents ){
                        return { then:function(){}};
                    }
                    return cloudifyClient.events.get( { 'deployment_id' :  $scope.id ,  'from_event': 0, 'batch_size' : 50 , 'include_logs' :  false , 'order' : 'desc' }).then(function (result) {
                        $scope.events = result.data.hits.hits;
                        $scope.lastEvent = _.first($scope.events);
                        //Formatting the timestamp
                        _.each($scope.events, function(e){
                            e.formattedTimestamp = EventsMap.getFormattedTimestamp(e._source.timestamp);
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
                    }
                    else {
                        $scope.minimizeMode = false;
                    }
                }

                function mousemove(event) {
                    var currentY = event.clientY; // clientY increases if mouse is lower on screen.
                    var newHeight = dragFromHeight + dragFromY - currentY;



                    var c = $element.find('.containList');
                    var maxHeight = $element.parent().height();

                    newHeight= Math.min(newHeight, maxHeight);

                    // don't allow element overflow from page anyway..
                    if ($element.find('.events-widget').position().top <= 0 ){
                        newHeight = Math.min(newHeight, c.height());
                    }


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
