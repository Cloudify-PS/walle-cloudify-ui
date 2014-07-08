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
            var oQuery = ejs.QueryStringQuery();
            var client = ejs.Request()
                .from(0)
                .size(1000);
            var activeFilters = {};
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

            function _isActiveFilter(field, term) {
                return activeFilters.hasOwnProperty(field + term);
            }

            function _applyFilters(query) {
                var filter = null;
                var filters = Object.keys(activeFilters).map(function (k) {
                    return activeFilters[k];
                });
                if (filters.length > 1) {
                    filter = ejs.AndFilter(filters);
                }
                else if (filters.length === 1) {
                    filter = filters[0];
                }
                return filter ? ejs.FilteredQuery(query, filter) : query;
            }

            function _autoPull(callbackFn) {
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
                        $timeout(_internalPull, autoPullTimer);
                    }, false);
                }, autoPullTimer);
                return deferred.promise;
            }

            function filter(field, term) {
                if(!filterRemove(field, term)) {
                    activeFilters[field + term] = ejs.TermFilter(field, term.toLowerCase());
                }
            }

            function filterRemove(field, term) {
                if(_isActiveFilter(field, term)) {
                    delete activeFilters[field + term];
                    return true;
                }
                return false;
            }

            function filterRange(field, conditions) {
                if(_isActiveFilter(field, rangePrefix)) {
                    delete activeFilters[field + rangePrefix];
                }
                if(conditions !== undefined) {
                    activeFilters[field + rangePrefix] = ejs.RangeFilter(field);
                    for(var c in conditions) {
                        var condition = conditions[c];
                        if(activeFilters[field + rangePrefix].hasOwnProperty(c)) {
                            activeFilters[field + rangePrefix] = activeFilters[field + rangePrefix][c](condition);
                        }
                    }
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

            function execute(callbackFn, autoPull) {
                var results;
                if(sortField) {
                    //$log.info(['Query 1: ', _applyFilters(oQuery.query('*')).toString()])
                    results = client
                        .query(_applyFilters(oQuery.query('*')))
                        .sort([sortField])
                        .doSearch();
                }
                else {
                    //$log.info(['Query 2: ', _applyFilters(oQuery.query('*')).toString()])
                    results = client
                        .query(_applyFilters(oQuery.query('*')))
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
                            _autoPull(callbackFn);
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
            _this.execute = execute;
        }

        this.newInstance = function(server) {
            return new Events(server);
        };

    });
