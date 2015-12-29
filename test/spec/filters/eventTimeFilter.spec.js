'use strict';

describe('Filter: eventTimeFilter', function () {
    var eventTimeFilter;

    describe('Test setup', function () {
        it('Injecting required data & initializing a new instance', function () {
            // load the filter's module
            module('cosmoUiApp', 'ngMock', 'backend-mock');

            // initialize a new instance of the filter
            inject(function ($filter, $httpBackend) {
                $httpBackend.whenGET('/backend/configuration?access=all').respond(200);
                $httpBackend.whenGET('/backend/versions/ui').respond(200);
                $httpBackend.whenGET('/backend/versions/manager').respond(200);
                $httpBackend.whenGET('/backend/version/latest?version=00').respond('300');

                eventTimeFilter = $filter('eventTimeFilter');
            });
        });
    });

    describe('Unit tests', function () {
        it('has a eventTime filter', function () {
            expect(eventTimeFilter).not.toBeUndefined();
        });

        it('should include \'Today\' string for current timestamp', function () {
            var result = eventTimeFilter(new Date().getTime());

            expect(result.indexOf('Today') > -1).toBe(true);
        });

        it('should return right date for given timestamp', function () {
            var timestamp = new Date(2014, 1, 24, 10, 30, 50, 0).getTime();
            var result = eventTimeFilter(timestamp);

            expect(result).toBe('24/2 10:30:50');
        });

        it('should add a weekday if timerange is less than a week', function () {
            var result = eventTimeFilter(new Date().getTime() - 86400002);
            var dow = result.split(' ')[0];
            expect(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(dow) >= 0).toBe(true);
        });
    });
});
