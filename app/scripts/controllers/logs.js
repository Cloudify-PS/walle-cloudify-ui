'use strict';

angular.module('cosmoUi')
    .controller('LogsCtrl', function ($scope, BreadcrumbsService, RestService, EventsService, $location, $anchorScroll) {

        /**
         * Breadcrumbs
         */
        BreadcrumbsService.push('logs', {
            href: '#/logs',
            i18nKey: 'breadcrumb.logs',
            id: 'logs'
        });


        /**
         * Logs
         */
        $scope.events = [];
        $scope.executionList = [{'value': null, 'label': 'All'}];
        $scope.defaultTimeframe = 1000 * 60 * 5;
        $scope.timeframeList = [
            {'value': 1000 * 60 * 5, 'label': 'Last 5 Minute'},
            {'value': 1000 * 60 * 10, 'label': 'Last 10 Minute'},
            {'value': 1000 * 60 * 15, 'label': 'Last 15 Minute'},
            {'value': 1000 * 60 * 30, 'label': 'Last 30 Minute'},
            {'value': 1000 * 60 * 45, 'label': 'Last 45 Minute'},
            {'value': 1000 * 60 * 60, 'label': 'Last Hour'},
            {'value': 1000 * 60 * 60 * 2, 'label': 'Last 2 Hours'},
            {'value': 1000 * 60 * 60 * 5, 'label': 'Last 5 Hours'},
            {'value': 1000 * 60 * 60 * 10, 'label': 'Last 10 Hours'},
            {'value': 1000 * 60 * 60 * 15, 'label': 'Last 15 Hours'},
            {'value': 1000 * 60 * 60 * 15, 'label': 'Last 20 Hours'},
            {'value': 1000 * 60 * 60 * 24, 'label': 'Last Day'},
            {'value': 1000 * 60 * 60 * 24 * 2, 'label': 'Last 2 Days'}
        ];
        $scope.eventTypeList = [];
        $scope.filterLoading = false;
        $scope.eventsFilter = {
            'executions': null,
            'timeframe': null
        };



        RestService.loadBlueprints()
            .then(function (data) {
                for (var j in data) {
                    var deployments = data[j].deployments;
                    for (var i = 0; i < deployments.length; i++) {
                        _loadExecutions(deployments[i].id);
                    }
                }
            });

        function _loadExecutions(deploymentId) {
            RestService.getDeploymentExecutions(deploymentId)
                .then(function(data) {
                    if(data.hasOwnProperty('length') && data.length > 0) {
                        for(var eid in data) {
                            var execute = data[eid];
                            $scope.executionList.push({'value': execute.deploymentId, 'label': execute.deploymentId + ' (' + execute.blueprintId + ')'});
                        }
                    }
                });
        }

        var events = EventsService.newInstance('/backend/events'),
            lastNodeSearch = $scope.eventsFilter.nodes;

        $scope.eventsFilter = {
            'type': null,
            'workflow': null,
            'nodes': null
        };

        function executeEvents(autoPull) {
            $scope.filterLoading = true;
            $scope.newEvents = 0;
            $scope.eventHits = [];
            var troubleShoot = 0,
                executeRetry = 10,
                lastAmount = 0,
                eventsCollect = [];

            function _reverse(array) {
                var copy = [].concat(array);
                return copy.reverse();
            }

            events
                .execute(function(data){
                    if(data && data.hasOwnProperty('hits')) {
                        if(data.hits.hits.length !== lastAmount) {
                            if(document.body.scrollTop === 0) {
                                $scope.newEvents = 0;
                                $scope.eventHits = _reverse(data.hits.hits);
                            }
                            else {
                                eventsCollect = _reverse(data.hits.hits);
                                $scope.newEvents = eventsCollect.length - $scope.eventHits.length;
                            }
                            lastAmount = data.hits.hits.length;
                        }
                    }
                    else {
                        console.warn('Cant load events, undefined data.');
                        troubleShoot++;
                    }
                    $scope.filterLoading = false;

                    // Stop AutoPull after 10 failures
                    if(troubleShoot === executeRetry) {
                        events.stopAutoPull();
                    }
                }, autoPull);
        }

        function filterEvents(field, newValue, oldValue, execute) {
            if(newValue === null) {
                return;
            }
            if(oldValue !== null && oldValue.value !== null) {
                events.filter(field, oldValue.value);
            }
            if(newValue.value !== null) {
                events.filter(field, newValue.value);
            }
            if(execute === true) {
                executeEvents();
            }
        }

        function filterLogsByRange(field, newValue, execute) {
            if(newValue === null) {
                events.filterRange(field);
            }
            if(newValue !== null) {
                events.filterRange(field, newValue);
            }
            if(execute === true) {
                executeEvents();
            }
        }

        function _filterByTimeframe( timestamp ) {
            var fromTime = new Date();
            var toTime = new Date();
            return {
                'gte': fromTime.setTime(fromTime.getTime() - timestamp),
                'lte': toTime
            };
        }

        (function _LoadEvents() {
            filterLogsByRange('@timestamp', _filterByTimeframe($scope.defaultTimeframe), null);
            filterEvents('type', {value: 'cloudify_log'}, null);
            executeEvents(true);
        })();

        $scope.scrollToTop = function(){
            $anchorScroll();
        };

        $scope.$watch('eventsFilter.executions', function(newValue, oldValue){
            if((newValue !== undefined && newValue !== null) && (oldValue !== undefined && oldValue !== null)) {
                filterEvents('context.deployment_id', newValue, oldValue, true);
            }
        });

        $scope.$watch('eventsFilter.timeframe', function(newValue){
            if(newValue !== null && newValue !== undefined && newValue.hasOwnProperty('value')) {
                filterLogsByRange('@timestamp', _filterByTimeframe(newValue.value), true);
            }
        });

        $scope.eventFindNodes = function() {
            if($scope.eventsFilter.nodes === '') {
                $scope.eventsFilter.nodes = null;
            }
            filterEvents('context.node_name', {value: $scope.eventsFilter.nodes}, {value: lastNodeSearch}, true);
            lastNodeSearch = $scope.eventsFilter.nodes;
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

        $scope.isSorted = function (field) {
            if ($scope.eventSortList.current === field) {
                return $scope.eventSortList[field];
            }
        };

    });
