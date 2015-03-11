'use strict';

/**
 * @ngdoc function
 * @name cosmoUiAppApp.controller:DeploymentEventsCtrl
 * @description
 * # DeploymenteventsCtrl
 * Controller of the cosmoUiAppApp
 */
angular.module('cosmoUiApp')
    .controller('DeploymentEventsCtrl', function ($scope, $routeParams, $filter, $log, $location, $anchorScroll, EventsService, EventsMap) {

        var id = $routeParams.deploymentId;
        $scope.deploymentId = $routeParams.deploymentId;
        $scope.workflowsList = [];
        $scope.eventTypeList = [];
        $scope.filterLoading = false;
        $scope.eventsFilter = {
            'type': null,
            'workflow': null,
            'nodes': null
        };

        $scope.$on('workflowsData', function (event, workflows) {
            $scope.workflowsList = workflows;
        });

        (function eventListForMenu() {
            var eventTypeList = [{'value': null, 'label': 'All'}];
            for (var eventType in EventsMap.getEventsList()) {
                eventTypeList.push({'value': eventType, 'label': EventsMap.getEventText(eventType)});
            }
            $scope.eventTypeList = eventTypeList;
        })();

        var events = EventsService.newInstance('/backend/events'),
            lastNodeSearch = $scope.eventsFilter.nodes;

        events.setAutoPullByDate(true);

        $scope.eventsFilter = {
            'type': null,
            'workflow': null,
            'nodes': null
        };

        var lastAmount = 0;

        function executeEvents(autoPull) {
            $scope.filterLoading = true;
            $scope.newEvents = 0;
            $scope.eventHits = [];
            var troubleShoot = 0,
                executeRetry = 10,
                eventsCollect = [],
                lastData = [];

            function _convertDates(data) {
                for (var i in data) {
                    data[i]._source.timestamp = $filter('dateFormat')(data[i]._source.timestamp, 'yyyy-MM-dd HH:mm:ss');
                }
                return data;
            }

            function pushLogs(data) {
                $scope.newLogs = 0;
                $scope.eventHits = data.concat($scope.eventHits);
                lastData = data;
            }

            events.execute(function (data) {
                if (data && data.hasOwnProperty('hits')) {
                    var dataHits = _convertDates(data.hits.hits);
                    if (dataHits.length > 0) {
                        if (dataHits.length !== lastAmount) {
                            if (document.body.scrollTop === 0 || $scope.eventHits.length === 0) {
                                pushLogs(dataHits);
                            }
                            else {
                                eventsCollect = dataHits;
                                $scope.newEvents = eventsCollect.length - $scope.eventHits.length;
                            }
                            lastAmount = dataHits.length;
                        }
                        else {
                            pushLogs(dataHits);
                        }
                    }
                }
                else {
                    $log.info('Cant load events, undefined data.');
                    troubleShoot++;
                }
                $scope.filterLoading = false;

                // Stop AutoPull after 10 failures
                if (troubleShoot === executeRetry) {
                    events.stopAutoPull();
                }
            }, autoPull, true);
        }

        function filterEvents(field, newValue, oldValue, execute) {
            if (newValue === null) {
                return;
            }
            if (oldValue !== null && oldValue.value !== null) {
                events.filter(field, oldValue.value);
            }
            if (newValue.value !== null) {
                events.filter(field, newValue.value);
            }
            if (execute === true) {
                executeEvents();
            }
        }

        (function _LoadEvents() {
            filterEvents('type', {value: 'cloudify_event'}, null);
            filterEvents('context.deployment_id', {value: id}, null);
            executeEvents(true);
        })();

        $scope.scrollToTop = function () {
            $anchorScroll();
        };

        $scope.$watch('eventsFilter.type', function (newValue, oldValue) {
            if (newValue !== null && oldValue !== null) {
                filterEvents('event_type', newValue, oldValue, true);
            }
        });

        $scope.$watch('eventsFilter.workflow', function (newValue, oldValue) {
            if (newValue !== null && oldValue !== null) {
                filterEvents('context.workflow_id', newValue, oldValue, true);
            }
        });

        $scope.eventFindNodes = function () {
            if ($scope.eventsFilter.nodes === '') {
                $scope.eventsFilter.nodes = null;
            }
            filterEvents('context.node_name', {value: $scope.eventsFilter.nodes}, {value: lastNodeSearch}, true);
            lastNodeSearch = $scope.eventsFilter.nodes;
        };

        $scope.clearFindNode = function () {
            $scope.eventsFilter.nodes = '';
            $scope.eventFindNodes();
        };

        $scope.eventSortList = {};
        $scope.sortEvents = function (field) {
            if (!$scope.eventSortList.hasOwnProperty(field)) {
                $scope.eventSortList[field] = false;
                $scope.eventSortList.current = false;
            }
            if ($scope.eventSortList.current !== field) {
                $scope.eventSortList[field] = false;
            }
            switch ($scope.eventSortList[field]) {
            case false:
                $scope.eventSortList[field] = 'desc';
                break;
            case 'desc':
                $scope.eventSortList[field] = 'asc';
                break;
            case 'asc':
                $scope.eventSortList[field] = false;
                break;
            }
            $scope.eventSortList.current = field;

            // Apply Sort
            events.sort(field, $scope.eventSortList[field]);
            executeEvents();
        };

        $scope.isSortActive = function () {
            if ($scope.eventSortList.hasOwnProperty('current')) {
                if ($scope.eventSortList.hasOwnProperty($scope.eventSortList.current)) {
                    if ($scope.eventSortList[$scope.eventSortList.current] !== false) {
                        return false;
                    }
                }
            }
            return true;
        };

        $scope.$watch('eventSortList', function (data) {
            if (!data.hasOwnProperty('current')) {
                return;
            }
            if ($scope.isSortActive()) {
                executeEvents(true);
            }
            else {
                events.stopAutoPull();
            }
        }, true);

        $scope.isSorted = function (field) {
            if ($scope.eventSortList.current === field) {
                return $scope.eventSortList[field];
            }
        };

        $scope.getEventIcon = function (event) {
            return EventsMap.getEventIcon(event);
        };

        $scope.getEventText = function (event) {
            return EventsMap.getEventText(event);
        };

        $scope.viewLogsByEvent = function (event) {
            var logsFilter = {
                'blueprints': [
                    event._source.context.blueprint_id
                ],
                'deployments': [
                    event._source.context.deployment_id
                ],
                'executions': [
                    event._source.context.execution_id
                ],
                'timeframe': [300000],
                'startdate': new Date(event._source.timestamp).getTime()
            };
            $location.url('logs').search('filter', JSON.stringify(logsFilter));
        };

        $scope.viewAllLogs = function () {
            if ($scope.eventHits.length > 0) {
                $scope.viewLogsByEvent($scope.eventHits[0]);
            }
        };

        $scope.getNodeById = function (node_id) {
            var _node = {};
            $scope.dataTable.forEach(function (node) {
                if (node.id === node_id) {
                    _node = node;
                }
            });
            return _node;
        };

    });
