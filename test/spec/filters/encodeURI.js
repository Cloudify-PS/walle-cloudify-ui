'use strict';

describe('Filter: encodeURI', function () {
    // load the filter's module
    beforeEach(module('cosmoUiApp'));

    // initialize a new instance of the filter before each test
    var encodeURI;
    beforeEach(inject(function ($filter) {
        encodeURI = $filter('encodeURI');
    }));

    it('should return the input prefixed with "encodeURI filter:"', function () {
        var uri = '{"matchAny":"[\\"all\\"]"}';
        expect(encodeURI(uri)).toBe('%7B%22matchAny%22%3A%22%5B%5C%22all%5C%22%5D%22%7D');
    });

});
