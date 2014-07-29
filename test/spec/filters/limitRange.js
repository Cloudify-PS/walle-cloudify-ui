'use strict';

describe('Filter: limitRange', function () {

    // load the filter's module
    beforeEach(module('cosmoUiApp'));

    // initialize a new instance of the filter before each test
    var limitRange;
    beforeEach(inject(function ($filter) {
        limitRange = $filter('limitRange');
    }));

    it('has a limitRange filter', function(){
        expect(limitRange).not.toBeUndefined();
    });

    it('should return a sliced data according to parameters', function () {
        var text = 'fulltext';
        var result = limitRange(text, 4, text.length);

        expect(result).toBe('text');
    });

});
