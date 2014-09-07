'use strict';

/**
 * @ngdoc directive
 * @name cosmoUiAppApp.directive:deploymentEvents
 * @description
 * # deploymentEvents
 */
angular.module('cosmoUiApp')
    .directive('deploymentEvents', function ($log, $filter, EventsService) {
        return {
            templateUrl: 'views/deployment/eventWidget.html',
            restrict: 'EA',
            scope: {
                id: '=deploymentEvents'
            },
            link: function postLink($scope) {

                $scope.events = [];

                var events = EventsService.newInstance('/backend/events'),
                    troubleShoot = 0,
                    executeRetry = 10,
                    lastAmount = 0;

                function executeEvents() {
                    function _convertDates(data) {
                        for(var i in data) {
                            data[i]._source.timestamp = $filter('dateFormat')(data[i]._source.timestamp, 'yyyy-MM-dd HH:mm:ss');
                        }
                        return data;
                    }

                    function pushLogs(data) {
                        $scope.events = data.concat($scope.events);
                    }

                    events.execute(function(data){
                        if(data && data.hasOwnProperty('hits')) {
                            var dataHits = _convertDates(data.hits.hits);
                            if(data.hits.hits.length !== lastAmount) {
                                pushLogs(dataHits);
                                lastAmount = dataHits.length;
                            }
                        }
                        else {
                            $log.info('Cant load events, undefined data.');
                            troubleShoot++;
                        }

                        // Stop AutoPull after 10 failures
                        if(troubleShoot === executeRetry) {
                            events.stopAutoPull();
                        }
                    }, true, true);
                }

                function filterEvents(field, newValue, oldValue) {
                    if(newValue === null) {
                        return;
                    }
                    if(oldValue !== null && oldValue.value !== null) {
                        events.filter(field, oldValue.value);
                    }
                    if(newValue.value !== null) {
                        events.filter(field, newValue.value);
                    }
                }

                filterEvents('type', {value: 'cloudify_event'}, null);
                filterEvents('context.deployment_id', {value: $scope.id}, null);
                executeEvents();

            }
        };
    });
