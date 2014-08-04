'use strict';

describe('Filter: eventTimeFilter', function () {

    // load the filter's module
    beforeEach(module('cosmoUiApp'));

    // initialize a new instance of the filter before each test
    var eventTimeFilter;
    beforeEach(inject(function ($filter) {
        eventTimeFilter = $filter('eventTimeFilter');
    }));

    it('has a eventTime filter', function(){
        expect(eventTimeFilter).not.toBeUndefined();
    });

    it('should include "Today" string for current timestamp', function() {
        var result = eventTimeFilter(new Date().getTime());

        expect(result.indexOf('Today') > -1).toBe(true);
    });

    it('should return right date for given timestamp', function() {
        var timestamp = new Date(2014, 1, 24, 10, 30, 50, 0).getTime();
        var result = eventTimeFilter(timestamp);

        expect(result).toBe('24/2 10:30:50');
    });
});
