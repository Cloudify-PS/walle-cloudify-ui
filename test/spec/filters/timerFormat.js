'use strict';

describe('Filter: timerFormat', function () {

    // load the filter's module
    beforeEach(module('cosmoUiApp'));

    // initialize a new instance of the filter before each test
    var timerFormat;
    beforeEach(inject(function ($filter) {
        timerFormat = $filter('timerFormat');
    }));

    it('should return default value', function(){
        expect(timerFormat(undefined)).toBe('00:00');
        expect(timerFormat(undefined, true)).toBe('00:00:00');
    });

    it('should format seconds to timer', function () {
        var seconds = 0;
        expect(timerFormat(seconds)).toBe('00:00');
        expect(timerFormat(seconds, true)).toBe('00:00:00');

        seconds = 500;
        expect(timerFormat(seconds)).toBe('08:20');
        expect(timerFormat(seconds, true)).toBe('00:08:20');

        seconds = 600;
        expect(timerFormat(seconds)).toBe('10:00');
        expect(timerFormat(seconds, true)).toBe('00:10:00');

        seconds = 10000;
        expect(timerFormat(seconds)).toBe('166:40');
        expect(timerFormat(seconds, true)).toBe('02:46:40');
    });
});
