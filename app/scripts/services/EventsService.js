'use strict';

angular.module('cosmoUiApp')
    .service('EventsService', function EventsService($http, $timeout, $q, ejsResource, $log, $rootScope) {

        function Events(server) {

            if(!server) {
                return;
            }

            /*jshint validthis: true */
            var _this = this;
            var ejs = ejsResource(server);
            var client = ejs.Request()
                .from(0)
                .size(1000);
            var activeFilters = {};
            var rangeFilter = {};
            var rangePrefix = 'range';
            var isAutoPull = false;
            var autoPullTimer = '3000';
            var sortField = false;
            var fieldIndex = {
                'timestamp': '@timestamp',
                'eventType': 'event_type',
                'node': 'context.node_name',
                'task': 'message.text'
            };
            var lastData = [];
            var mergeData = false;
            var isAutoPullByDate = false;

            $rootScope.$on('$locationChangeStart', function() {
                if(isAutoPull) {
                    isAutoPull = false;
                    $log.info('Stop pulling events.');
                }
            });

            function setAutoPullByDate(condition) {
                isAutoPullByDate = condition;
            }

            function _applyFilters() {
                var filters = [];
                for(var field in activeFilters) {
                    filters.push(ejs.TermsFilter(field, activeFilters[field]));
                }
                for(var rangeField in rangeFilter) {
                    filters.push(ejs.RangeFilter(rangeField).from(rangeFilter[rangeField].gte).to(rangeFilter[rangeField].lte));
                }
                return ejs.AndFilter(filters);
            }


            function _autoPull(callbackFn, customPullTime) {
                var deferred = $q.defer();
                isAutoPull = true;
                $timeout(function _internalPull() {
                    if(isAutoPullByDate) {
                        _autoPullByLastDate();
                    }
                    if(!isAutoPull) {
                        deferred.resolve('Events Auto Pull Stop!');
                        return;
                    }
                    execute(function(data){
                        if(angular.isFunction(callbackFn)) {
                            callbackFn(data);
                        }
                        deferred.notify(data);
                        $timeout(_internalPull, customPullTime !== undefined ? customPullTime : autoPullTimer);
                    }, false);
                }, autoPullTimer);
                return deferred.promise;
            }

            function filter(field, term) {
                if(!activeFilters.hasOwnProperty(field)) {
                    activeFilters[field] = [];
                }
                if(activeFilters[field].indexOf(term.toLowerCase()) === -1) {
                    activeFilters[field].push(term.toLowerCase());
                }
            }

            function filterRemove(field, term) {
                if(rangeFilter.hasOwnProperty(field)) {
                    delete rangeFilter[field];
                    return true;
                }
                if(activeFilters.hasOwnProperty(field)) {
                    term = term.toLowerCase();
                    if(activeFilters[field].indexOf(term) !== -1) {
                        activeFilters[field].splice(activeFilters[field].indexOf(term), 1);
                    }
                    if(activeFilters[field].length === 0) {
                        delete activeFilters[field];
                    }
                    return true;
                }
                return false;
            }

            function filterRange(field, conditions) {
                if(conditions !== undefined) {
                    if(!rangeFilter.hasOwnProperty(field)) {
                        rangeFilter[field] = [];
                    }
                    rangeFilter[field] = conditions;
                }
            }

            function sort(field, order) {
                var _innerField = fieldIndex.hasOwnProperty(field) ? fieldIndex[field] : field;
                switch(order) {
                case 'desc':
                case 'asc':
                    sortField = ejs.Sort(_innerField).order(order);
                    break;
                default:
                    sortField = false;
                    break;
                }
            }

            function stopAutoPull() {
                isAutoPull = false;
            }

            function _getLastResultDate() {
                if(lastData.hasOwnProperty('hits') && lastData.hits.hits.length > 0) {
                    return lastData.hits.hits[0]._source['@timestamp'];
                }
                return null;
            }

            function _autoPullByLastDate() {
                if(sortField) {
                    filterRemove('@timestamp', rangePrefix);
                    mergeData = false;
                }
                else {
                    var lastTime = _getLastResultDate();
                    if(lastTime !== null) {
                        filterRange('@timestamp', {
                            gt: lastTime
                        });
                        mergeData = true;
                    }
                }
            }

            function mergeLastDataWith(data) {
                if(data.hasOwnProperty('hits') && data.hits.hits.length > 0) {
                    for(var i in data.hits.hits) {
                        lastData.hits.hits.push(data.hits.hits[i]);
                    }
                    return lastData;
                }
                return data;
            }

            function execute(callbackFn, autoPull, customPullTime) {
                var results;
                if(sortField) {
                    results = client
                        .query(ejs.MatchAllQuery())
                        .filter(_applyFilters())
                        .sort([sortField])
                        .doSearch();
                }
                else {
                    results = client
                        .query(ejs.MatchAllQuery())
                        .filter(_applyFilters())
                        .sort([ejs.Sort('@timestamp').order('desc')])
                        .doSearch();
                }
                results.then(function(data){
                    if(data.hasOwnProperty('error')) {
                        $log.error(data.error);
                    }
                    else if(angular.isFunction(callbackFn)) {
                        if(mergeData === true) {
                            mergeLastDataWith(data);
                        }
                        callbackFn(data);
                        lastData = data;
                        if(autoPull === true) {
                            _this.autoPull(callbackFn, customPullTime);
                        }
                    }
                });
            }

            _this.setAutoPullByDate = setAutoPullByDate;
            _this.filter = filter;
            _this.filterRemove = filterRemove;
            _this.filterRange = filterRange;
            _this.sort = sort;
            _this.stopAutoPull = stopAutoPull;
            _this.autoPull = _autoPull;
            _this.execute = execute;
        }

        this.newInstance = function(server) {
            return new Events(server);
        };

    });
