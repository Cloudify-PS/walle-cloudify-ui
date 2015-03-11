'use strict';

angular.module('cosmoUiApp')
    .controller('LogsCtrl', function ($scope, BreadcrumbsService, EventsService, $location, $anchorScroll, $filter, $routeParams, LogsModel, $window, EventsMap, $log, CloudifyService) {

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
        $scope.events = EventsService.newInstance('/backend/events');
        var _deploymentsList = [],
            _executionList = [];

        var defaultForwardTime = 1000 * 60 * 5;

        $scope.blueprintsList = [];
        $scope.deploymentsList = [];
        $scope.executionList = [];

        $scope.eventsFilter = {
            'blueprints': [],
            'deployments': [],
            'executions': [],
            'timeframe': []
        };

        $scope.defaultTimeframe = 1000 * 60 * 5;
        $scope.timeframeList = [
            {'value': 1000 * 60 * 5, 'label': '5 Minutes'},
            {'value': 1000 * 60 * 10, 'label': '10 Minutes'},
            {'value': 1000 * 60 * 15, 'label': '15 Minutes'},
            {'value': 1000 * 60 * 30, 'label': '30 Minutes'},
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
        $scope.isDialogVisible = false;
        $scope.errorMsg = null;
        $scope.isSearchDisabled = true;

        var lastAmount = 0;

        function executeLogs(autoPull, executeOptions) {
            $scope.filterLoading = true;
            $scope.newLogs = 0;
            $scope.logsHits = [];
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

            function pushLogs() {
                $scope.newLogs = 0;
                $scope.logsHits = lastData;
            }

            angular.element($window).bind('scroll', function () {
                if (lastData.length !== $scope.logsHits.length && document.body.scrollTop === 0) {
                    pushLogs();
                }
            });

            $scope.events.execute(function (data) {
                if (data && data.hasOwnProperty('hits')) {
                    lastData = _convertDates(data.hits.hits);
                    if (lastData.length !== lastAmount) {
                        if (document.body.scrollTop === 0 || $scope.logsHits) {
                            pushLogs();
                        }
                        else {
                            eventsCollect = lastData;
                            $scope.newLogs = eventsCollect.length - $scope.logsHits.length;
                        }
                        lastAmount = lastData.length;
                    }
                    else {
                        pushLogs();
                    }
                }
                else {
                    if (data.hasOwnProperty('error_code')) {
                        $scope.isDialogVisible = true;
                        $scope.errorMsg = data.message;
                    }
                    $log.warn('Cant load events, undefined data.');
                    troubleShoot++;
                }
                $scope.filterLoading = false;

                // Stop AutoPull after 10 failures
                if (troubleShoot === executeRetry) {
                    $scope.events.stopAutoPull();
                }
            }, autoPull, false, executeOptions);
        }

        if ($routeParams.filter) {
            var filterParams;
            try {
                filterParams = JSON.parse($routeParams.filter);
            }
            catch (exception) {
                filterParams = null;
            }
            if (filterParams) {
                LogsModel.set(filterParams);
            }
        }
        $scope.filterModel = LogsModel.get();
        $scope.timeframeFrom = LogsModel.getFromTimeText();

        $scope.closeErrorDialog = function () {
            $scope.isDialogVisible = false;
            $scope.errorMsg = null;
        };

        CloudifyService.blueprints.list()
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
                _autoFirstPull();
            });

        function _autoFirstPull() {
            angular.forEach($scope.blueprintsList, function (blueprint) {
                $scope.eventsFilter.blueprints.push(blueprint);
            });
            if ($scope.eventsFilter.deployments.length > 0) {
                executeLogs();
            }
        }

        function _loadExecutions(deployment_id) {
            CloudifyService.deployments.getDeploymentExecutions(deployment_id)
                .then(function (data) {
                    if (data.hasOwnProperty('length') && data.length > 0) {
                        for (var eid in data) {
                            var execute = data[eid];
                            _executionList.push({
                                'value': execute.id,
                                'label': execute.workflow_id + ' (' + $filter('dateFormat')(execute.created_at, 'yyyy-MM-dd HH:mm:ss') + ')',
                                'parent': deployment_id
                            });
                        }
                    }
                });
        }

        function filterLogsByList(field, newValues, oldValues, execute) {
            for (var oi in oldValues) {
                $scope.events.filterRemove(field, oldValues[oi].value);
            }
            for (var ni in newValues) {
                $scope.events.filter(field, newValues[ni].value);
            }
            if (execute === true) {
                executeLogs();
            }
        }

        function filterLogsByRange(field, newValue, execute, executeOptions) {
            if (newValue === null) {
                $scope.events.filterRange(field);
            }
            if (newValue !== null) {
                $scope.events.filterRange(field, newValue);
            }
            if (execute === true) {
                executeLogs(executeOptions);
            }
        }

        function _filterByTimeframe(timestamp) {
            return {
                'gte': timestamp,
                'lte': defaultForwardTime
            };
        }

        (function _LoadEvents() {
            filterLogsByRange('@timestamp', _filterByTimeframe($scope.defaultTimeframe), null);
        })();

        $scope.execute = function () {
            if (!$scope.isSearchDisabled) {
                executeLogs();
            }
        };

        $scope.scrollToTop = function () {
            $anchorScroll();
        };

        $scope.$watch('eventsFilter.blueprints', function (newValue, oldValue) {
            $scope.isSearchDisabled = (newValue === null || newValue.length === 0);
            $scope.deploymentsList = $filter('filterListByList')(_deploymentsList, newValue);
            filterLogsByList('context.blueprint_id', newValue, oldValue, false);
        }, true);

        $scope.$watch('eventsFilter.deployments', function (newValue, oldValue) {
            $scope.executionList = $filter('filterListByList')(_executionList, newValue);
            filterLogsByList('context.deployment_id', newValue, oldValue, false);
            $scope.$watch(function () {
                return _executionList;
            }, function () {
                $scope.executionList = $filter('filterListByList')(_executionList, newValue);
            }, true);
        }, true);

        $scope.$watch('eventsFilter.executions', function (newValue, oldValue) {
            filterLogsByList('context.execution_id', newValue, oldValue, false);
        }, true);

        $scope.$watch('eventsFilter.timeframe', function (newValue) {
            if (newValue !== null && newValue !== undefined && newValue.hasOwnProperty('value')) {
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
            $scope.events.sort(field, $scope.eventSortList[field]);
            executeLogs();
        };

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

        var longetPeriod = $scope.timeframeList[$scope.timeframeList.length - 1];
        filterLogsByRange('@timestamp', _filterByTimeframe(longetPeriod.value), true, $scope.events.getExecuteLastFiftyOptions());
    });

angular.module('cosmoUiApp')
    .filter('filterListByList', function filterListByList() {
        return function (list, filterList) {
            var results = [];
            for (var f in filterList) {
                var filter = filterList[f];
                for (var l in list) {
                    var item = list[l];
                    if (item.parent === filter.value) {
                        results.push(item);
                    }
                }
            }
            return results;
        };
    });
