'use strict';

angular.module('cosmoUi')
    .controller('LogsCtrl', function ($scope, BreadcrumbsService, RestService, EventsService, $location, $anchorScroll, $filter, $routeParams, LogsModel, $window) {

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
        var events = EventsService.newInstance('/backend/events'),
            _deploymentsList = [],
            _executionList = [];

        $scope.blueprintsList = [];
        $scope.deploymentsList = [];
        $scope.executionList = [];

        $scope.eventsFilter = {
            'blueprints': null,
            'deployments': null,
            'executions': null,
            'timeframe': null
        };

        $scope.timeframeFrom = 'now';

        $scope.defaultTimeframe = 1000 * 60 * 5;
        $scope.timeframeList = [
            {'value': 1000 * 60 * 5, 'label': '5 Minute'},
            {'value': 1000 * 60 * 10, 'label': '10 Minute'},
            {'value': 1000 * 60 * 15, 'label': '15 Minute'},
            {'value': 1000 * 60 * 30, 'label': '30 Minute'},
            {'value': 1000 * 60 * 60, 'label': '1 Hour'},
            {'value': 1000 * 60 * 60 * 3, 'label': '3 Hours'},
            {'value': 1000 * 60 * 60 * 6, 'label': '6 Hours'},
            {'value': 1000 * 60 * 60 * 12, 'label': '12 Hours'},
            {'value': 1000 * 60 * 60 * 24, 'label': '1 Day'},
            {'value': 1000 * 60 * 60 * 24 * 2, 'label': '2 Days'},
            {'value': 1000 * 60 * 60 * 24 * 3, 'label': '3 Days'},
            {'value': 1000 * 60 * 60 * 24 * 4, 'label': '4 Days'},
            {'value': 1000 * 60 * 60 * 24 * 5, 'label': '5 Days'}
        ];
        $scope.eventTypeList = [];
        $scope.filterLoading = false;

        function executeEvents(autoPull) {
            $scope.filterLoading = true;
            $scope.newLogs = 0;
            $scope.logsHits = [];
            var troubleShoot = 0,
                executeRetry = 10,
                lastAmount = 0,
                eventsCollect = [],
                lastData = [];

            function _reverse(array) {
                var copy = [].concat(array);
                return copy.reverse();
            }

            function pushLogs() {
                $scope.newLogs = 0;
                $scope.logsHits = _reverse(lastData);
            }

            angular.element($window).bind('scroll', function(){
                if(lastData.length !== $scope.logsHits.length && document.body.scrollTop === 0) {
                    pushLogs();
                }
            });

            events
                .execute(function(data){
                    if(data && data.hasOwnProperty('hits')) {
                        lastData = data.hits.hits;
                        if(lastData.length !== lastAmount) {
                            if(document.body.scrollTop === 0) {
                                pushLogs();
                            }
                            else {
                                eventsCollect = _reverse(lastData);
                                $scope.newLogs = eventsCollect.length - $scope.logsHits.length;
                            }
                            lastAmount = lastData.length;
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

        if($routeParams.filter) {
            var filterParams;
            try {
                filterParams = JSON.parse($routeParams.filter);
            }
            catch(exception) {
                filterParams = null;
            }
            if(filterParams) {
                LogsModel.set(filterParams);
            }
        }
        else {
            executeEvents();
        }
        $scope.filterModel = LogsModel.get();

        RestService.loadBlueprints()
            .then(function (data) {
                for (var j in data) {
                    var blueprint = data[j];
                    $scope.blueprintsList.push({'value': blueprint.id, 'label': blueprint.id});
                    for (var i in blueprint.deployments) {
                        var deployemnt = blueprint.deployments[i];
                        _deploymentsList.push({'value': deployemnt.id, 'label': deployemnt.id, 'parent': blueprint.id});
                        _loadExecutions(deployemnt.id);
                    }
                }
                executeEvents();
            });

        function _loadExecutions(deploymentId) {
            RestService.getDeploymentExecutions(deploymentId)
                .then(function(data) {
                    if(data.hasOwnProperty('length') && data.length > 0) {
                        for(var eid in data) {
                            var execute = data[eid];
                            _executionList.push({'value': execute.deploymentId, 'label': execute.deploymentId, 'parent': deploymentId});
                        }
                    }
                });
        }

        function filterLogs(field, newValue, oldValue, execute) {
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

        function filterLogsByList(field, newValues, oldValues, execute) {
            for(var oi in oldValues) {
                events.filterRemove(field, oldValues[oi].value);
            }
            for(var ni in newValues) {
                events.filter(field, newValues[ni].value);
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
            filterLogs('type', {value: 'cloudify_log'}, null);
        })();

        $scope.execute = function() {
            executeEvents();
        };

        $scope.scrollToTop = function(){
            $anchorScroll();
        };

        $scope.$watch('eventsFilter.blueprints', function(newValue, oldValue){
            $scope.deploymentsList = $filter('filterListByList')(_deploymentsList, newValue);
            filterLogsByList('context.blueprint_id', newValue, oldValue, false);
        }, true);

        $scope.$watch('eventsFilter.deployments', function(newValue, oldValue){
            $scope.executionList = $filter('filterListByList')(_executionList, newValue);
            filterLogsByList('context.deployment_id', newValue, oldValue, false);
        }, true);

        $scope.$watch('eventsFilter.executions', function(newValue, oldValue){
            $scope.executionList = $filter('filterListByList')(_executionList, newValue);
            filterLogsByList('context.execution_id', newValue, oldValue, false);
        }, true);

        $scope.$watch('eventsFilter.timeframe', function(newValue){
            if(newValue !== null && newValue !== undefined && newValue.hasOwnProperty('value')) {
                filterLogsByRange('@timestamp', _filterByTimeframe(newValue.value), false);
            }
        });

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

angular.module('cosmoUi')
    .filter('filterListByList', function filterListByList() {
        return function (list, filterList) {
            var results = [];
            for(var f in filterList) {
                var filter = filterList[f];
                for(var l in list) {
                    var item = list[l];
                    if(item.parent === filter.value) {
                        results.push(item);
                    }
                }
            }
            return results;
        };
    });