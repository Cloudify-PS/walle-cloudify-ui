'use strict';

describe('Service: EventsService', function () {

    var eventsService, events, _callback, query,
        isExecuted = false;


    var timeRangeBackward = (1000 * 60 * 15);
    var timeRangeForward = (1000 * 60 * 5);

    function _rangeTime(time) {
        var fromTime = new Date();
        return new Date(fromTime.setTime(time));
    }

    beforeEach(module('cosmoUiApp', 'ngMock', 'backend-mock', 'elasticjs.service', 'elasticjs.service'));
    beforeEach(
        // initialize a new instance of the filter
        inject(function (EventsService) {

            eventsService = EventsService;

            events = eventsService.newInstance('/backend/events');

            _callback = function () {
                isExecuted = true;
            };
        }));


    it('should create a new EventsService instance', function () {
        expect(!!eventsService).toBe(true);
    });

    it('should use defined autopull time provided by controller', inject(function ($q, $timeout) {
        var client = events.getClient();
        client.doSearch = function () {
            var deferred = $q.defer();
            deferred.resolve({});
            return deferred.promise;
        };

        spyOn(events, 'autoPull').andCallThrough();

        events.execute(_callback, true, 1000);
        $timeout.flush();

        waitsFor(function () {
            return isExecuted;
        });

        runs(function () {
            expect(events.autoPull).toHaveBeenCalledWith(_callback, 1000);
            isExecuted = false;
        });
    }));

    it('should return the last 50 backward filter (CFY-1983)', inject(function ($q, $timeout) {
        var client = events.getClient();

        client.doSearch = function () {
            query = this._self();
            var deferred = $q.defer();
            deferred.resolve({});
            return deferred.promise;
        };

        events.execute(_callback, false, false, events.getExecuteLastFiftyOptions());
        $timeout.flush();

        waitsFor(function () {
            return isExecuted;
        });

        runs(function () {
            isExecuted = false;
            expect(query.size).toBe(50);
        });

    }));

    it('should verify elastic search query sort ignores unmapped fields (CFY-2204)', function () {
        var defaultOptions = events.getExecuteDefaultOptions();
        expect(defaultOptions.sort.ignoreUnmapped()).toBe(true);

        var last50Options = events.getExecuteLastFiftyOptions();
        expect(last50Options.sort.ignoreUnmapped()).toBe(true);
    });


    describe('Unit tests for specific query', function () {
        beforeEach(inject(function ($q) {
            var client = events.getClient();
            client.doSearch = function () {
                query = this._self();
                var deferred = $q.defer();
                deferred.resolve({});
                return deferred.promise;
            };

            events.filter('blueprint_id', 'monitoringbp');
            events.filter('deployment_id', 'monitoringdep');
            events.filter('deployment_id', 'MonitoringBpTest');
            events.filterRange('@timestamp', {
                gte: timeRangeBackward, // = 15 min backward
                lte: timeRangeForward // = 5 min forward
            });
            events.execute(_callback, false);
        }));


        /*jshint camelcase: false */

        it('should create query with 3 filters', function () {
            expect(query.filter.and.filters.length).toBe(3);
        });

        it('should create query with blueprint ID filter', function () {
            expect(query.filter.and.filters[0].terms.blueprint_id[0]).toEqual('monitoringbp');
        });

        it('should create query with two deployments ID filter', function () {
            expect(query.filter.and.filters[1].terms.deployment_id[0]).toEqual('monitoringdep');
            expect(query.filter.and.filters[1].terms.deployment_id[1]).toEqual('MonitoringBpTest');
        });

        it('should create query with @timestamp range 15 min backward filter', function () {
            var startTime = new Date().getTime();
            expect(query.filter.and.filters[2].range['@timestamp'].from.toString()).toEqual(_rangeTime(startTime - timeRangeBackward).toString());
        });

        it('should create query with @timestamp range 5 min forward filter', function () {
            var startTime = new Date().getTime();
            expect(query.filter.and.filters[2].range['@timestamp'].to.toString()).toEqual(_rangeTime(startTime + timeRangeForward).toString());
        });

        it('should return the second deployment id as camel case (CFY-1675)', function () {
            /*jshint camelcase: false */
            expect(query.filter.and.filters[1].terms.deployment_id[1]).toEqual('MonitoringBpTest');
        });

    });
});
