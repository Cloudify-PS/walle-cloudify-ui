'use strict';

describe('Filter: encodeURIComponent', function () {

    // load the filter's module
    beforeEach(module('cosmoUiApp'));

    // initialize a new instance of the filter before each test
    var encodeURIComponent;
    beforeEach(inject(function ($filter) {
        encodeURIComponent = $filter('encodeURIComponent');
    }));

    it('should return the input prefixed with "encodeURIComponent filter:"', function () {
        var text = '{"matchAny":["simple"]}';
        expect(encodeURIComponent(text)).toBe('%7B%22matchAny%22%3A%5B%22simple%22%5D%7D');
    });

});
