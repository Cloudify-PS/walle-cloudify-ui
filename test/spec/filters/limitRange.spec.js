'use strict';

describe('Filter: limitRange', function () {
    var limitRange;

    describe('Test setup', function() {
        it('Injecting required data & initializing a new instance', function() {
            // load the filter's module
            module('cosmoUiApp');

            // initialize a new instance of the filter
            inject(function ($filter) {
                limitRange = $filter('limitRange');
            });
        });
    });

    describe('Unit tests', function() {
        it('has a limitRange filter', function(){
            expect(limitRange).not.toBeUndefined();
        });

        it('should return a sliced data according to parameters', function () {
            var text = 'fulltext';
            var result = limitRange(text, 4, text.length);

            expect(result).toBe('text');
        });
    });
});
