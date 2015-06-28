'use strict';

angular.module('cosmoUiApp')
    .service('EventsService', function EventsService($http, $q, ejsResource, $log, $rootScope, $filter ) {

        function Events(server) {

            if(!server) {
                return;
            }

            /*jshint validthis: true */
            var _this = this;
            var ejs = ejsResource(server);
            var activeFilters = {};
            var client = ejs.Request()
                .from(0)
                .size(1000);
            var rangeFilter = {};
            var rangePrefix = 'range';
            var isAutoPull = false;
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
                var startTime = new Date().getTime();
                for(var field in activeFilters) {
                    filters.push(ejs.TermsFilter(field, activeFilters[field]));
                }
                for(var rangeField in rangeFilter) {
                    filters.push(ejs.RangeFilter(rangeField)
                            .from(_rangeTime(startTime - rangeFilter[rangeField].gte))
                            .to(_rangeTime(startTime + rangeFilter[rangeField].lte))
                    );
                }
                return ejs.AndFilter(filters);
            }

            function _rangeTime(time) {
                var fromTime = new Date();
                return new Date(fromTime.setTime(time));
            }

            function filter(field, term) {
                if(!activeFilters.hasOwnProperty(field)) {
                    activeFilters[field] = [];
                }
                if(typeof term === 'string' && activeFilters[field].indexOf(term) === -1) {
                    activeFilters[field].push(term);
                }
            }

            function filterRemove(field, term) {
                if(rangeFilter.hasOwnProperty(field)) {
                    delete rangeFilter[field];
                    return true;
                }
                if(activeFilters.hasOwnProperty(field)) {
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
                    sortField = ejs.Sort(_innerField).order(order).ignoreUnmapped(true);
                    break;
                default:
                    sortField = false;
                    break;
                }
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

            function _getExecuteDefaultOptions() {
                return {
                    query: ejs.MatchAllQuery(),
                    sort: sortField ? sortField : ejs.Sort('@timestamp').order('desc').ignoreUnmapped(true),
                    filters: _applyFilters(),
                    clientFrom: 0,
                    clientTo: 1000
                };
            }

            function _getExecuteLastFiftyOptions() {
                var options = _getExecuteDefaultOptions();

                options.sort = ejs.Sort('@timestamp').order('desc').ignoreUnmapped(true);
                options.filters = ejs.AndFilter([]);
                options.clientTo = 50;

                return options;
            }

            /**
             * options = {
                    query: ejs query obj,
                    sort: ejs sort obj,
                    filters: ejs filters obj,
                    clientFrom: ejs client request from,
                    clientTo: ejs client request to
                };
             *
             * @param callbackFn
             * @param options
             */
            function execute(callbackFn, options) {
                var results;

                if (!options) {
                    options = _getExecuteDefaultOptions();
                }

                if(isAutoPullByDate) {
                    _autoPullByLastDate();
                }

                client.from(options.clientFrom)
                    .size(options.clientTo);

                results = client
                    .query(options.query)
                    .filter(options.filters)
                    .sort([options.sort])
                    .doSearch();

                results.then(function(data){
                    if(data.hasOwnProperty('error')) {
                        $log.error(data.error);
                    }

                    else if(angular.isFunction(callbackFn)) {
                        // hack - the js rest client returns a result in different format. we reverse its change.
                        // todo: we should align to the js client format.
                        data = {
                            hits : {
                                hits: data.events
                            },
                            total : data.total_events
                        };
                        if(mergeData === true) {
                            mergeLastDataWith(data);
                        }
                        callbackFn(data, results);
                        lastData = data;
                    }
                });
            }

            _this.setAutoPullByDate = setAutoPullByDate;
            _this.filter = filter;
            _this.filterRemove = filterRemove;
            _this.filterRange = filterRange;
            _this.sort = sort;
            _this.execute = execute;
            _this.getExecuteLastFiftyOptions = _getExecuteLastFiftyOptions;
            _this.getExecuteDefaultOptions = _getExecuteDefaultOptions;
            _this.getClient = function(){ return client; }; // for tests..
        }

        this.newInstance = function(server) {
            return new Events(server);
        };

        /**
         * converts timestamp from what we get from manager to a pattern
         * @param timestamp
         * @returns {*}
         */
        this.convertTimestamp = function( timestamp ) {
            return $filter('dateFormat')(timestamp, 'yyyy-MM-dd HH:mm:ss');
        };

    });
