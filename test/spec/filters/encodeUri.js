'use strict';

describe('Filter: encodeUri', function () {
    // load the filter's module
    beforeEach(module('cosmoUiApp'));

    // initialize a new instance of the filter before each test
    var encodeUri;
    beforeEach(inject(function ($filter) {
        encodeUri = $filter('encodeUri');
    }));

    it('should return the input prefixed with "encodeUri filter:"', function () {
        var uri = '{"matchAny":"[\\"all\\"]"}';
        expect(encodeUri(uri)).toBe('%7B%22matchAny%22%3A%22%5B%5C%22all%5C%22%5D%22%7D');
    });

});
