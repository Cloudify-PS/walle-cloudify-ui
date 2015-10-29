'use strict';

describe('Filter: stringify', function () {

    // load the filter's module
    beforeEach(module('cosmoUiApp'));

    // initialize a new instance of the filter before each test
    var stringify;
    beforeEach(inject(function ($filter) {
        stringify = $filter('stringify');
    }));

    it('should return the input prefixed with "stringify filter:"', function () {
        var obj = {matchAny: ['simple']};
        expect(stringify(obj)).toBe('{"matchAny":["simple"]}');
    });

});
